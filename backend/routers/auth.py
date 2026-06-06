from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas import UserCreate, UserResponse, LoginRequest, Token, UserUpdate, ForgotPasswordRequest
from models import User
from dependencies import get_db_session, require_active_user
from services.user_service import UserService
from auth import create_access_token, verify_password
from services import restore_lives
from config import settings

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, db: Session = Depends(get_db_session)):
    service = UserService(db)
    try:
        user = service.create_user(
            email=data.email,
            password=data.password,
            full_name=data.full_name,
            avatar_color=data.avatar_color
        )
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
async def login(data: LoginRequest, db: Session = Depends(get_db_session)):
    service = UserService(db)
    user = service.get_by_email(data.email)
    
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль"
        )
    
    restore_lives(user)
    db.commit()
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_me(current_user: User = Depends(require_active_user)):
    restore_lives(current_user)
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(require_active_user)
):
    service = UserService(db)
    return service.update_user(current_user, **data.model_dump(exclude_unset=True))

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_me(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(require_active_user)
):
    service = UserService(db)
    service.delete_user(current_user)
    return None

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db_session)):
    if data.secret_word != settings.RESET_SECRET:
        raise HTTPException(status_code=403, detail="Неверное секретное слово")
    
    service = UserService(db)
    user = service.get_by_email(data.email)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    from auth import get_password_hash
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"status": "success", "message": "Пароль успешно изменен"}
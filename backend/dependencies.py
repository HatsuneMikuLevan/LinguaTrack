from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_active_user, get_current_user
from models import User

async def get_db_session(db: Session = Depends(get_db)):
    """Гарантирует закрытие сессии БД после запроса."""
    try:
        yield db
    finally:
        db.close()

async def require_active_user(user: User = Depends(get_current_active_user)):
    """Проверяет, что пользователь авторизован и активен."""
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация"
        )
    return user

async def require_admin(user: User = Depends(require_active_user)):
    """Для будущей админ-панели. Сейчас просто заглушка."""
    return user
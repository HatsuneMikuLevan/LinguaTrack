from sqlalchemy.orm import Session
from datetime import date, datetime, timezone
from models import User
from auth import get_password_hash, generate_avatar_color

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email.lower()).first()
    
    def create_user(self, email: str, password: str, full_name: str | None = None, avatar_color: str | None = None) -> User:
        existing = self.get_by_email(email)
        if existing:
            raise ValueError("Пользователь с таким email уже существует")
        
        hashed = get_password_hash(password)
        color = avatar_color or generate_avatar_color(email.lower())
        
        user = User(
            email=email.lower(),
            hashed_password=hashed,
            full_name=full_name,
            avatar_color=color
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def update_user(self, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            if value is not None and hasattr(user, key):
                setattr(user, key, value)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def delete_user(self, user: User):
        self.db.delete(user)
        self.db.commit()
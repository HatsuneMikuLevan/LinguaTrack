import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Загружаем переменные из .env файла (если он есть)
load_dotenv()

# Ищем DATABASE_URL в переменных окружения. Если её нет — используем локальную SQLite.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./linguatrack.db")

# Небольшой фикс: некоторые провайдеры дают ссылку, начинающуюся с postgres://
# Но современные версии SQLAlchemy требуют строго postgresql://
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Специфичные аргументы нужны только для SQLite
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    connect_args = {"check_same_thread": False}
else:
    connect_args = {} # Для PostgreSQL они не требуются

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# --- ДОБАВЛЕННАЯ ФУНКЦИЯ ДЛЯ СОЗДАНИЯ ТАБЛИЦ ---
def init_db():
    # Важно: импортируем файл с моделями (User, Goal и т.д.) прямо внутри функции.
    # Это нужно, чтобы SQLAlchemy узнал о существовании твоих таблиц перед их созданием,
    # и чтобы избежать кругового импорта (circular import).
    try:
        import models # Если файлы main.py и models.py лежат в одной папке backend
    except ImportError:
        from backend import models # Если запускается из корня всего проекта
        
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

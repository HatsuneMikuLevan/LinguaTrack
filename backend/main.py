import os
from datetime import date, datetime, timedelta, timezone
from typing import List

import auth
import models
import schemas
from config import settings
from database import get_db, init_db
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import register_routers
from services.common import restore_lives
from sqlalchemy import func
from sqlalchemy.orm import Session

# Импортируем UserService для работы с обновлением профиля напрямую
from services.user_service import UserService 

app = FastAPI(title="LinguaTrack API", version="5.2")

# Инициализация базы данных
init_db()

# Базовые адреса для локальной разработки
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
 ]

# Динамически добавляем адрес фронтенда из переменной окружения на продакшене
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)
    if frontend_url.endswith("/"):
        origins.append(frontend_url.rstrip("/"))

# Настройка CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Регистрация всех роутеров проекта (включая твой auth router)
register_routers(app)


# === ИСПРАВЛЕНИЕ ХЕНДЛЕРА СМЕНЫ ЦВЕТА (PATCH /me) ===
@app.patch("/me", response_model=schemas.UserResponse)
async def update_profile_direct(
    data: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    # Используем твой же UserService для обновления, чтобы всё работало через общую бизнес-логику
    service = UserService(db)
    return service.update_user(current_user, **data.model_dump(exclude_unset=True))


# === Activity endpoint ===
@app.get("/activity", response_model=List[schemas.ActivityDay])
async def get_activity(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    start_date = date.today() - timedelta(days=365)

    logs = (
        db.query(
            func.date(models.ProgressLog.logged_at).label("day"),
            func.count(models.ProgressLog.id).label("count"),
        )
        .filter(
            models.ProgressLog.user_id == current_user.id,
            models.ProgressLog.logged_at >= start_date,
        )
        .group_by(func.date(models.ProgressLog.logged_at))
        .all()
    )

    pomodoros = (
        db.query(
            func.date(models.PomodoroSession.started_at).label("day"),
            func.count(models.PomodoroSession.id).label("count"),
        )
        .filter(
            models.PomodoroSession.user_id == current_user.id,
            models.PomodoroSession.started_at >= start_date,
            models.PomodoroSession.is_completed == True,
        )
        .group_by(func.date(models.PomodoroSession.started_at))
        .all()
    )

    activity_map = {}
    for day, count in logs:
        activity_map[str(day)] = activity_map.get(str(day), 0) + count
    for day, count in pomodoros:
        activity_map[str(day)] = activity_map.get(str(day), 0) + count

    result = []
    for i in range(365):
        d = date.today() - timedelta(days=364 - i)
        d_str = str(d)
        result.append(
            schemas.ActivityDay(date=d_str, count=activity_map.get(d_str, 0))
        )

    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)


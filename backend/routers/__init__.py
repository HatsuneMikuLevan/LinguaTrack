from fastapi import APIRouter
from .auth import router as auth_router
from .goals import router as goals_router
from .vocabulary import router as vocabulary_router
from .pomodoro import router as pomodoro_router
from .friends import router as friends_router
from .daily_tasks import router as daily_tasks_router
from .shop import router as shop_router
from .quests import router as quests_router
from .achievements import router as achievements_router

def register_routers(app):
    app.include_router(auth_router, prefix="/auth", tags=["auth"])
    app.include_router(goals_router, prefix="/goals", tags=["goals"])
    app.include_router(vocabulary_router, prefix="/vocabulary", tags=["vocabulary"])
    app.include_router(pomodoro_router, prefix="/pomodoro", tags=["pomodoro"])
    app.include_router(friends_router, prefix="/friends", tags=["friends"])
    app.include_router(daily_tasks_router, prefix="/daily-tasks", tags=["daily-tasks"])
    app.include_router(shop_router, prefix="/shop", tags=["shop"])
    app.include_router(quests_router, prefix="/quests", tags=["quests"])
    app.include_router(achievements_router, prefix="/achievements", tags=["achievements"])
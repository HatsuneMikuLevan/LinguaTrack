from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from schemas import DailyTaskCreate, DailyTaskResponse
from models import DailyTask
from dependencies import get_db_session, require_active_user
from services import update_user_activity, check_achievements

router = APIRouter()

@router.get("/", response_model=List[DailyTaskResponse])
async def get_daily_tasks(
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    today = date.today()
    tasks = db.query(DailyTask).filter(
        DailyTask.user_id == current_user.id,
        DailyTask.task_date == today
    ).order_by(DailyTask.created_at.desc()).all()
    return tasks

@router.post("/", response_model=DailyTaskResponse, status_code=status.HTTP_201_CREATED)
async def create_daily_task(
    task: DailyTaskCreate,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    db_task = DailyTask(
        user_id=current_user.id,
        title=task.title,
        category=task.category,
        xp_reward=task.xp_reward,
        gems_reward=task.gems_reward,
        task_date=date.today()
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.patch("/{task_id}/toggle", response_model=DailyTaskResponse)
async def toggle_daily_task(
    task_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    task = db.query(DailyTask).filter(
        DailyTask.id == task_id,
        DailyTask.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    
    task.is_completed = not task.is_completed
    db.commit()
    db.refresh(task)
    
    if task.is_completed:
        update_user_activity(current_user, db, xp_gain=task.xp_reward, gems_gain=task.gems_reward)
        check_achievements(current_user, db)
    
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_daily_task(
    task_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    task = db.query(DailyTask).filter(
        DailyTask.id == task_id,
        DailyTask.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    db.delete(task)
    db.commit()
    return None
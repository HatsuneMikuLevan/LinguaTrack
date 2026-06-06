from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from schemas import GoalCreate, GoalUpdate, GoalResponse, GoalProgressUpdate, ProgressLogResponse
from models import Goal
from dependencies import get_db_session, require_active_user
from services.goal_service import GoalService
from services import update_user_activity, check_achievements, get_or_create_daily_quests

router = APIRouter()

@router.get("/", response_model=List[GoalResponse])
async def get_goals(
    archived: Optional[bool] = False,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    service = GoalService(db, current_user)
    return service.get_goals(archived=archived)

@router.post("/", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal: GoalCreate,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    service = GoalService(db, current_user)
    try:
        db_goal = service.create_goal(goal)
        update_user_activity(current_user, db, xp_gain=10)
        check_achievements(current_user, db)
        
        quests = get_or_create_daily_quests(current_user, db)
        for uq in quests:
            if uq.quest.type == "create_goal" and not uq.is_completed:
                uq.progress += 1
                if uq.progress >= uq.quest.target_count:
                    uq.is_completed = True
                    update_user_activity(current_user, db, xp_gain=uq.quest.xp_reward, gems_gain=uq.quest.gems_reward)
        
        return db_goal
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.get("/{goal_id}", response_model=GoalResponse)
async def get_goal(
    goal_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    service = GoalService(db, current_user)
    goal = service.get_goal(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    return goal

@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: int,
    goal_update: GoalUpdate,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    service = GoalService(db, current_user)
    goal = service.get_goal(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    return service.update_goal(goal, goal_update)

@router.patch("/{goal_id}/progress", response_model=GoalResponse)
async def update_progress(
    goal_id: int,
    progress_data: GoalProgressUpdate,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    service = GoalService(db, current_user)
    goal = service.get_goal(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    
    try:
        goal, xp_gain, is_completed = service.update_progress(goal, progress_data)
        update_user_activity(current_user, db, xp_gain=xp_gain)
        check_achievements(current_user, db)
        
        quests = get_or_create_daily_quests(current_user, db)
        for uq in quests:
            if uq.quest.type == "add_progress" and not uq.is_completed:
                uq.progress += 1
                if uq.progress >= uq.quest.target_count:
                    uq.is_completed = True
                    update_user_activity(current_user, db, xp_gain=uq.quest.xp_reward, gems_gain=uq.quest.gems_reward)
        
        return goal
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{goal_id}/archive")
async def archive_goal(
    goal_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    service = GoalService(db, current_user)
    goal = service.get_goal(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    return service.toggle_archive(goal)

@router.get("/{goal_id}/history", response_model=List[ProgressLogResponse])
async def get_goal_history(
    goal_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    service = GoalService(db, current_user)
    goal = service.get_goal(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    return service.get_history(goal_id)

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    service = GoalService(db, current_user)
    goal = service.get_goal(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    service.delete_goal(goal)
    return None
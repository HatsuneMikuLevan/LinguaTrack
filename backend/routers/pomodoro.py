from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone, date
from schemas import PomodoroStart, PomodoroEnd, PomodoroResponse
from models import PomodoroSession
from dependencies import get_db_session, require_active_user
from services import update_user_activity, check_achievements, get_or_create_daily_quests

router = APIRouter()

@router.post("/start", response_model=PomodoroResponse)
async def start_pomodoro(
    data: PomodoroStart,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    session = PomodoroSession(
        user_id=current_user.id,
        goal_id=data.goal_id,
        duration_minutes=data.duration_minutes,
        started_at=datetime.now(timezone.utc)
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.post("/end", response_model=PomodoroResponse)
async def end_pomodoro(
    data: PomodoroEnd,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    session = db.query(PomodoroSession).filter(
        PomodoroSession.id == data.session_id,
        PomodoroSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Сессия не найдена")
    
    session.ended_at = datetime.now(timezone.utc)
    session.is_completed = data.is_completed
    db.commit()
    db.refresh(session)
    
    if data.is_completed:
        update_user_activity(current_user, db, xp_gain=15, gems_gain=2)
        check_achievements(current_user, db)
        
        quests = get_or_create_daily_quests(current_user, db)
        for uq in quests:
            if uq.quest.type == "pomodoro" and not uq.is_completed:
                uq.progress += 1
                if uq.progress >= uq.quest.target_count:
                    uq.is_completed = True
                    update_user_activity(current_user, db, xp_gain=uq.quest.xp_reward, gems_gain=uq.quest.gems_reward)
    
    return session

@router.get("/today", response_model=List[PomodoroResponse])
async def get_today_pomodoro(
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    today = date.today()
    sessions = db.query(PomodoroSession).filter(
        PomodoroSession.user_id == current_user.id,
        PomodoroSession.started_at >= datetime(today.year, today.month, today.day)
    ).order_by(PomodoroSession.started_at.desc()).all()
    return sessions
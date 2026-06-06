from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import AchievementResponse
from dependencies import get_db_session, require_active_user
from services import check_achievements
import models

router = APIRouter()

@router.get("/", response_model=List[AchievementResponse])
async def get_achievements(
    db: Session = Depends(get_db_session),
    current_user: models.User = Depends(require_active_user)
):
    check_achievements(current_user, db)
    
    all_achievements = db.query(models.Achievement).all()
    user_achievements = {ua.achievement_id: ua.unlocked_at for ua in current_user.achievements}
    
    result = []
    for ach in all_achievements:
        result.append(AchievementResponse(
            id=ach.id,
            title=ach.title,
            description=ach.description,
            icon=ach.icon,
            condition_type=ach.condition_type,
            threshold=ach.threshold,
            unlocked_at=user_achievements.get(ach.id),
            is_unlocked=ach.id in user_achievements
        ))
    return result
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import QuestResponse
from dependencies import get_db_session, require_active_user
from services import get_or_create_daily_quests

router = APIRouter()

@router.get("/", response_model=List[QuestResponse])
async def get_quests(
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    user_quests = get_or_create_daily_quests(current_user, db)
    
    result = []
    for uq in user_quests:
        result.append(QuestResponse(
            id=uq.quest.id,
            title=uq.quest.title,
            description=uq.quest.description,
            type=uq.quest.type,
            target_count=uq.quest.target_count,
            progress=uq.progress,
            is_completed=uq.is_completed,
            xp_reward=uq.quest.xp_reward,
            gems_reward=uq.quest.gems_reward
        ))
    
    return result
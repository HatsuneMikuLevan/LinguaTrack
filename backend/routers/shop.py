from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import random
from dependencies import get_db_session, require_active_user

router = APIRouter()

@router.post("/lives/buy")
async def buy_lives(
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    if current_user.gems < 50:
        raise HTTPException(status_code=400, detail="Недостаточно гемов! Нужно 50.")
    
    if current_user.lives >= current_user.max_lives:
        raise HTTPException(status_code=400, detail="Жизни уже полные!")
    
    current_user.gems -= 50
    current_user.lives = current_user.max_lives
    db.commit()
    
    return {"lives": current_user.lives, "gems": current_user.gems}

@router.post("/streak-freeze/use")
async def use_streak_freeze(
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    if current_user.streak_freeze_used:
        raise HTTPException(status_code=400, detail="Заморозка уже использована на этой неделе")
    
    if current_user.gems < 100:
        raise HTTPException(status_code=400, detail="Недостаточно гемов! Нужно 100.")
    
    current_user.gems -= 100
    current_user.streak_freeze_used = True
    db.commit()
    
    return {"status": "success", "message": "Серия заморожена на сегодня"}

@router.post("/chests/open/{chest_id}")
async def open_chest(
    chest_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    from models import UserChest
    
    user_chest = db.query(UserChest).filter(
        UserChest.id == chest_id,
        UserChest.user_id == current_user.id,
        UserChest.is_opened == False
    ).first()
    
    if not user_chest:
        raise HTTPException(status_code=404, detail="Сундук не найден или уже открыт")
    
    gems = random.randint(user_chest.chest.min_gems, user_chest.chest.max_gems)
    xp = random.randint(user_chest.chest.min_xp, user_chest.chest.max_xp)
    
    user_chest.is_opened = True
    user_chest.opened_at = datetime.now(timezone.utc)
    user_chest.reward_gems = gems
    user_chest.reward_xp = xp
    
    current_user.gems += gems
    current_user.xp += xp
    
    db.commit()
    
    return {"gems": gems, "xp": xp}
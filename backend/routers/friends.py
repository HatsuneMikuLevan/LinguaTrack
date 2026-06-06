from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas import FriendRequest, FriendResponse, LeaderboardEntry
from models import Friendship, User
from dependencies import get_db_session, require_active_user

router = APIRouter()

@router.post("/request")
async def send_friend_request(
    data: FriendRequest,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    friend = db.query(User).filter(User.email == data.friend_email.lower()).first()
    if not friend:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    if friend.id == current_user.id:
        raise HTTPException(status_code=400, detail="Нельзя добавить себя")
    
    existing = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == friend.id)) |
        ((Friendship.user_id == friend.id) & (Friendship.friend_id == current_user.id))
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Заявка уже существует")
    
    friendship = Friendship(user_id=current_user.id, friend_id=friend.id, status="pending")
    db.add(friendship)
    db.commit()
    return {"status": "success"}

@router.patch("/{friendship_id}/accept")
async def accept_friendship(
    friendship_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    fs = db.query(Friendship).filter(
        Friendship.id == friendship_id,
        Friendship.friend_id == current_user.id,
        Friendship.status == "pending"
    ).first()
    if not fs:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    fs.status = "accepted"
    db.commit()
    return {"status": "accepted"}

@router.get("/", response_model=List[FriendResponse])
async def get_friends(
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    sent = db.query(Friendship).filter(
        Friendship.user_id == current_user.id,
        Friendship.status == "accepted"
    ).all()
    
    received = db.query(Friendship).filter(
        Friendship.friend_id == current_user.id,
        Friendship.status == "accepted"
    ).all()
    
    result = []
    for f in sent:
        result.append(FriendResponse(
            id=f.id,
            friend_name=f.friend.full_name or f.friend.email,
            friend_email=f.friend.email,
            friend_level=f.friend.level,
            friend_avatar=f.friend.avatar_color,
            status="accepted"
        ))
    for f in received:
        result.append(FriendResponse(
            id=f.id,
            friend_name=f.user.full_name or f.user.email,
            friend_email=f.user.email,
            friend_level=f.user.level,
            friend_avatar=f.user.avatar_color,
            status="accepted"
        ))
    
    return result

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    users = db.query(User).order_by(User.league_points.desc()).limit(50).all()
    
    result = []
    for i, u in enumerate(users):
        result.append(LeaderboardEntry(
            rank=i + 1,
            name=u.full_name or u.email.split('@')[0],
            level=u.level,
            xp=u.xp,
            avatar_color=u.avatar_color,
            is_me=(u.id == current_user.id)
        ))
    
    return result
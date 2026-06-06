from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from schemas import VocabularyCreate, VocabularyResponse
from models import VocabularyWord
from dependencies import get_db_session, require_active_user
from services import update_user_activity, check_achievements

router = APIRouter()

@router.post("/", response_model=VocabularyResponse, status_code=status.HTTP_201_CREATED)
async def add_word(
    data: VocabularyCreate,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    word = VocabularyWord(
        user_id=current_user.id,
        word=data.word,
        translation=data.translation,
        example=data.example
    )
    db.add(word)
    db.commit()
    db.refresh(word)
    
    update_user_activity(current_user, db, xp_gain=5, gems_gain=1)
    check_achievements(current_user, db)
    return word

@router.get("/", response_model=List[VocabularyResponse])
async def get_vocabulary(
    level: Optional[int] = None,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    query = db.query(VocabularyWord).filter(VocabularyWord.user_id == current_user.id)
    if level is not None:
        query = query.filter(VocabularyWord.level == level)
    words = query.order_by(VocabularyWord.created_at.desc()).all()
    return words

@router.delete("/{word_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_word(
    word_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    word = db.query(VocabularyWord).filter(
        VocabularyWord.id == word_id,
        VocabularyWord.user_id == current_user.id
    ).first()
    if not word:
        raise HTTPException(status_code=404, detail="Слово не найдено")
    db.delete(word)
    db.commit()
    return None

@router.patch("/{word_id}/review", response_model=VocabularyResponse)
async def review_word(
    word_id: int,
    is_correct: bool,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_active_user)
):
    word = db.query(VocabularyWord).filter(
        VocabularyWord.id == word_id,
        VocabularyWord.user_id == current_user.id
    ).first()
    if not word:
        raise HTTPException(status_code=404, detail="Слово не найдено")
    
    word.review_count += 1
    if is_correct:
        word.level = min(3, word.level + 1)
        update_user_activity(current_user, db, xp_gain=3, gems_gain=1)
    else:
        word.level = max(0, word.level - 1)
    
    from datetime import date, timedelta
    intervals = [1, 3, 7, 14]
    word.next_review = date.today() + timedelta(days=intervals[min(word.level, 3)])
    
    db.commit()
    db.refresh(word)
    return word
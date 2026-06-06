from datetime import datetime, timedelta, date, timezone
from sqlalchemy.orm import Session
import models

def restore_lives(user: models.User):
    now = datetime.now(timezone.utc)
    if user.lives < user.max_lives and user.last_life_restore:
        minutes_passed = (now - user.last_life_restore).total_seconds() / 60
        lives_to_restore = int(minutes_passed // 30)
        if lives_to_restore > 0:
            user.lives = min(user.max_lives, user.lives + lives_to_restore)
            leftover = minutes_passed % 30
            user.last_life_restore = now - timedelta(minutes=leftover)
    return user.lives

def update_user_activity(user: models.User, db: Session, xp_gain: int = 0, gems_gain: int = 0):
    today = date.today()
    if user.last_active_date != today:
        yesterday = today - timedelta(days=1)
        if user.last_active_date == yesterday:
            user.streak += 1
            user.streak_freeze_used = False
        else:
            if not user.streak_freeze_used:
                user.streak = 1
            else:
                user.streak_freeze_used = False
        user.last_active_date = today
    
    if xp_gain > 0:
        user.xp += xp_gain
        new_level = (user.xp // 100) + 1
        if new_level > user.level:
            user.level = new_level
            user.gems += 50
    
    if gems_gain > 0:
        user.gems += gems_gain
    
    user.league_points += xp_gain
    db.commit()
    db.refresh(user)

def check_achievements(user: models.User, db: Session):
    all_achievements = db.query(models.Achievement).all()
    user_achievements_ids = {ua.achievement_id for ua in user.achievements}
    
    for ach in all_achievements:
        if ach.id in user_achievements_ids:
            continue
            
        unlocked = False
        
        if ach.condition_type == "first_goal":
            if len(user.goals) >= ach.threshold:
                unlocked = True
        elif ach.condition_type == "complete_goal":
            completed = sum(1 for g in user.goals if g.progress >= g.target)
            if completed >= ach.threshold:
                unlocked = True
        elif ach.condition_type == "total_progress":
            total = sum(g.progress for g in user.goals)
            if total >= ach.threshold:
                unlocked = True
        elif ach.condition_type == "register":
            unlocked = True
        elif ach.condition_type == "streak":
            if user.streak >= ach.threshold:
                unlocked = True
        elif ach.condition_type == "pomodoro":
            count = db.query(models.PomodoroSession).filter(
                models.PomodoroSession.user_id == user.id,
                models.PomodoroSession.is_completed == True
            ).count()
            if count >= ach.threshold:
                unlocked = True
        elif ach.condition_type == "vocabulary":
            count = db.query(models.VocabularyWord).filter(models.VocabularyWord.user_id == user.id).count()
            if count >= ach.threshold:
                unlocked = True
                
        if unlocked:
            ua = models.UserAchievement(user_id=user.id, achievement_id=ach.id)
            db.add(ua)
    
    db.commit()

def get_or_create_daily_quests(user: models.User, db: Session):
    today = date.today()
    existing = db.query(models.UserQuest).filter(
        models.UserQuest.user_id == user.id,
        models.UserQuest.quest_date == today
    ).first()
    
    if existing:
        return db.query(models.UserQuest).filter(
            models.UserQuest.user_id == user.id,
            models.UserQuest.quest_date == today
        ).all()
    
    quests = db.query(models.Quest).filter(models.Quest.type == "daily").all()
    for q in quests:
        uq = models.UserQuest(user_id=user.id, quest_id=q.id, quest_date=today)
        db.add(uq)
    db.commit()
    
    return db.query(models.UserQuest).filter(
        models.UserQuest.user_id == user.id,
        models.UserQuest.quest_date == today
    ).all()
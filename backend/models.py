from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean, Date, Float
from sqlalchemy.orm import relationship
from datetime import datetime, date, timedelta
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    avatar_color = Column(String(7), default="#0d9488")
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    gems = Column(Integer, default=100)
    lives = Column(Integer, default=5)
    max_lives = Column(Integer, default=5)
    last_life_restore = Column(DateTime, default=datetime.utcnow)
    streak = Column(Integer, default=0)
    streak_freeze_used = Column(Boolean, default=False)
    last_active_date = Column(Date, nullable=True)
    league = Column(String(50), default="Бронза")
    league_points = Column(Integer, default=0)
    mascot_name = Column(String(50), default="Оуги")
    mascot_type = Column(String(50), default="owl")
    mascot_level = Column(Integer, default=1)
    room_theme = Column(String(50), default="default")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    goals = relationship("Goal", back_populates="owner", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    progress_logs = relationship("ProgressLog", back_populates="user", cascade="all, delete-orphan")
    daily_tasks = relationship("DailyTask", back_populates="user", cascade="all, delete-orphan")
    pomodoro_sessions = relationship("PomodoroSession", back_populates="user", cascade="all, delete-orphan")
    vocabulary = relationship("VocabularyWord", back_populates="user", cascade="all, delete-orphan")
    flashcard_sessions = relationship("FlashcardSession", back_populates="user", cascade="all, delete-orphan")
    friends_sent = relationship("Friendship", foreign_keys="Friendship.user_id", back_populates="user", cascade="all, delete-orphan")
    friends_received = relationship("Friendship", foreign_keys="Friendship.friend_id", back_populates="friend", cascade="all, delete-orphan")
    chests = relationship("UserChest", back_populates="user", cascade="all, delete-orphan")

class Goal(Base):
    __tablename__ = "goals"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    target = Column(Integer, nullable=False)
    progress = Column(Integer, default=0)
    deadline = Column(DateTime, nullable=True)
    is_archived = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    owner = relationship("User", back_populates="goals")
    progress_logs = relationship("ProgressLog", back_populates="goal", cascade="all, delete-orphan")

class ProgressLog(Base):
    __tablename__ = "progress_logs"
    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    old_progress = Column(Integer, nullable=False)
    new_progress = Column(Integer, nullable=False)
    note = Column(Text, nullable=True)
    logged_at = Column(DateTime, default=datetime.utcnow)
    
    goal = relationship("Goal", back_populates="progress_logs")
    user = relationship("User", back_populates="progress_logs")

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    icon = Column(String(50), nullable=False)
    condition_type = Column(String(50), nullable=False)
    threshold = Column(Integer, default=1)

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")

class DailyTask(Base):
    __tablename__ = "daily_tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(100), default="General")
    is_completed = Column(Boolean, default=False)
    xp_reward = Column(Integer, default=10)
    gems_reward = Column(Integer, default=5)
    task_date = Column(Date, default=date.today)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="daily_tasks")

class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=True)
    duration_minutes = Column(Integer, default=25)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    is_completed = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="pomodoro_sessions")

class VocabularyWord(Base):
    __tablename__ = "vocabulary"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    word = Column(String(100), nullable=False)
    translation = Column(String(100), nullable=False)
    example = Column(Text, nullable=True)
    level = Column(Integer, default=0) # 0=new, 1=learning, 2=known, 3=mastered
    next_review = Column(Date, default=date.today)
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="vocabulary")

class FlashcardSession(Base):
    __tablename__ = "flashcard_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    correct_count = Column(Integer, default=0)
    total_count = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="flashcard_sessions")

class Friendship(Base):
    __tablename__ = "friendships"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    friend_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="pending") # pending, accepted
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", foreign_keys=[user_id], back_populates="friends_sent")
    friend = relationship("User", foreign_keys=[friend_id], back_populates="friends_received")

class Chest(Base):
    __tablename__ = "chests"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False) # daily, weekly, streak
    name = Column(String(100), nullable=False)
    min_gems = Column(Integer, default=10)
    max_gems = Column(Integer, default=50)
    min_xp = Column(Integer, default=0)
    max_xp = Column(Integer, default=0)

class UserChest(Base):
    __tablename__ = "user_chests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    chest_id = Column(Integer, ForeignKey("chests.id"), nullable=False)
    is_opened = Column(Boolean, default=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
    opened_at = Column(DateTime, nullable=True)
    reward_gems = Column(Integer, nullable=True)
    reward_xp = Column(Integer, nullable=True)
    
    user = relationship("User", back_populates="chests")
    chest = relationship("Chest")

class Quest(Base):
    __tablename__ = "quests"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False) # daily, weekly
    target_count = Column(Integer, default=1)
    xp_reward = Column(Integer, default=20)
    gems_reward = Column(Integer, default=10)

class UserQuest(Base):
    __tablename__ = "user_quests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quest_id = Column(Integer, ForeignKey("quests.id"), nullable=False)
    progress = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    quest_date = Column(Date, default=date.today)
    
    user = relationship("User")
    quest = relationship("Quest")
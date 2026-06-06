from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    avatar_color: Optional[str] = "#0d9488"

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_color: Optional[str] = None
    mascot_name: Optional[str] = None
    room_theme: Optional[str] = None

class UserResponse(UserBase):
    id: int
    level: int
    xp: int
    gems: int
    lives: int
    max_lives: int
    streak: int
    streak_freeze_used: bool
    league: str
    league_points: int
    mascot_name: str
    mascot_type: str
    mascot_level: int
    room_theme: str
    last_active_date: Optional[date] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class GoalBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    target: int = Field(..., gt=0)
    deadline: Optional[datetime] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    target: Optional[int] = Field(None, gt=0)
    deadline: Optional[datetime] = None
    is_archived: Optional[bool] = None
    sort_order: Optional[int] = None

class GoalProgressUpdate(BaseModel):
    progress: int = Field(..., ge=0)
    note: Optional[str] = None

class GoalResponse(GoalBase):
    id: int
    progress: int
    is_archived: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
    owner_id: int
    
    class Config:
        from_attributes = True

class ProgressLogResponse(BaseModel):
    id: int
    goal_id: int
    old_progress: int
    new_progress: int
    note: Optional[str] = None
    logged_at: datetime
    
    class Config:
        from_attributes = True

class AchievementResponse(BaseModel):
    id: int
    title: str
    description: str
    icon: str
    condition_type: str
    threshold: int
    unlocked_at: Optional[datetime] = None
    is_unlocked: bool = False
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    secret_word: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6)

class DailyTaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = "General"
    xp_reward: Optional[int] = 10
    gems_reward: Optional[int] = 5

class DailyTaskResponse(BaseModel):
    id: int
    title: str
    category: str
    is_completed: bool
    xp_reward: int
    gems_reward: int
    task_date: date
    created_at: datetime
    
    class Config:
        from_attributes = True

class PomodoroStart(BaseModel):
    goal_id: Optional[int] = None
    duration_minutes: int = Field(default=25, ge=1, le=120)

class PomodoroEnd(BaseModel):
    session_id: int
    is_completed: bool

class PomodoroResponse(BaseModel):
    id: int
    goal_id: Optional[int]
    duration_minutes: int
    started_at: datetime
    ended_at: Optional[datetime]
    is_completed: bool
    
    class Config:
        from_attributes = True

class ActivityDay(BaseModel):
    date: str
    count: int

class VocabularyCreate(BaseModel):
    word: str = Field(..., min_length=1, max_length=100)
    translation: str = Field(..., min_length=1, max_length=100)
    example: Optional[str] = None

class VocabularyResponse(BaseModel):
    id: int
    word: str
    translation: str
    example: Optional[str]
    level: int
    next_review: date
    review_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class FlashcardResult(BaseModel):
    word_id: int
    is_correct: bool

class FlashcardSessionResponse(BaseModel):
    id: int
    correct_count: int
    total_count: int
    xp_earned: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class FriendRequest(BaseModel):
    friend_email: EmailStr

class FriendResponse(BaseModel):
    id: int
    friend_name: str
    friend_email: str
    friend_level: int
    friend_avatar: str
    status: str
    
    class Config:
        from_attributes = True

class LeaderboardEntry(BaseModel):
    rank: int
    name: str
    level: int
    xp: int
    avatar_color: str
    is_me: bool

class ChestResponse(BaseModel):
    id: int
    type: str
    name: str
    is_opened: bool
    earned_at: datetime
    
    class Config:
        from_attributes = True

class QuestResponse(BaseModel):
    id: int
    title: str
    description: str
    type: str
    target_count: int
    progress: int
    is_completed: bool
    xp_reward: int
    gems_reward: int
    
    class Config:
        from_attributes = True

class MascotResponse(BaseModel):
    name: str
    type: str
    level: int
    next_level_xp: int
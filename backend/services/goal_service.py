from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from models import Goal, ProgressLog, User, UserQuest
from schemas import GoalCreate, GoalUpdate, GoalProgressUpdate

class GoalService:
    def __init__(self, db: Session, user: User):
        self.db = db
        self.user = user
    
    def get_goals(self, archived: bool = False) -> List[Goal]:
        return self.db.query(Goal).filter(
            Goal.owner_id == self.user.id,
            Goal.is_archived == archived
        ).order_by(Goal.sort_order.asc(), Goal.created_at.desc()).all()
    
    def get_goal(self, goal_id: int) -> Goal | None:
        return self.db.query(Goal).filter(
            Goal.id == goal_id,
            Goal.owner_id == self.user.id
        ).first()
    
    def create_goal(self, goal_data: GoalCreate) -> Goal:
        if self.user.lives <= 0:
            raise ValueError("Нет жизней! Подождите 30 минут или купите за гемы.")
        
        max_order = self.db.query(Goal).filter(
            Goal.owner_id == self.user.id
        ).count()
        
        goal = Goal(
            **goal_data.model_dump(),
            owner_id=self.user.id,
            sort_order=max_order
        )
        self.db.add(goal)
        self.user.lives -= 1
        self.db.commit()
        self.db.refresh(goal)
        return goal
    
    def update_goal(self, goal: Goal, update_data: GoalUpdate) -> Goal:
        data = update_data.model_dump(exclude_unset=True)
        for field, value in data.items():
            setattr(goal, field, value)
        self.db.commit()
        self.db.refresh(goal)
        return goal
    
    def update_progress(self, goal: Goal, progress_data: GoalProgressUpdate) -> tuple[Goal, int, bool]:
        """Возвращает (goal, xp_gain, was_completed)."""
        if self.user.lives <= 0 and progress_data.progress > goal.progress:
            raise ValueError("Нет жизней! Подождите 30 минут или купите за гемы.")
        
        if progress_data.progress > goal.target:
            raise ValueError("Прогресс не может превышать цель")
        
        old_progress = goal.progress
        goal.progress = progress_data.progress
        
        xp_gain = 5
        was_completed = old_progress >= goal.target
        is_completed = goal.progress >= goal.target
        
        if not was_completed and is_completed:
            xp_gain += 100
        
        # Лог прогресса
        if old_progress != progress_data.progress:
            log = ProgressLog(
                goal_id=goal.id,
                user_id=self.user.id,
                old_progress=old_progress,
                new_progress=progress_data.progress,
                note=progress_data.note
            )
            self.db.add(log)
        
        # Жизнь тратится только при увеличении
        if progress_data.progress > old_progress:
            self.user.lives -= 1
        
        self.db.commit()
        self.db.refresh(goal)
        return goal, xp_gain, is_completed
    
    def toggle_archive(self, goal: Goal) -> Goal:
        goal.is_archived = not goal.is_archived
        self.db.commit()
        self.db.refresh(goal)
        return goal
    
    def delete_goal(self, goal: Goal):
        self.db.delete(goal)
        self.db.commit()
    
    def get_history(self, goal_id: int) -> List[ProgressLog]:
        return self.db.query(ProgressLog).filter(
            ProgressLog.goal_id == goal_id,
            ProgressLog.user_id == self.user.id
        ).order_by(ProgressLog.logged_at.desc()).limit(30).all()
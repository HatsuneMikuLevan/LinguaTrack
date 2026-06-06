from database import init_db, SessionLocal
from models import User, Achievement, Quest, Chest
from auth import get_password_hash

def seed_data():
    init_db()
    
    with SessionLocal() as db:
        achievements = [
            Achievement(title="Первые шаги", description="Создайте первую цель", icon="Target", condition_type="first_goal", threshold=1),
            Achievement(title="Марафонец", description="Создайте 5 целей", icon="Flag", condition_type="first_goal", threshold=5),
            Achievement(title="Первая победа", description="Выполните первую цель", icon="Trophy", condition_type="complete_goal", threshold=1),
            Achievement(title="Мастер", description="Выполните 5 целей", icon="Star", condition_type="complete_goal", threshold=5),
            Achievement(title="Прогрессор", description="Наберите 1000 единиц прогресса", icon="TrendingUp", condition_type="total_progress", threshold=1000),
            Achievement(title="Добро пожаловать", description="Присоединитесь к LinguaTrack", icon="Sparkles", condition_type="register", threshold=1),
            Achievement(title="Непрерывность", description="3 дня подряд", icon="Flame", condition_type="streak", threshold=3),
            Achievement(title="Фокус", description="Завершите 5 помидоров", icon="Timer", condition_type="pomodoro", threshold=5),
            Achievement(title="Словарь", description="Добавьте 10 слов", icon="BookOpen", condition_type="vocabulary", threshold=10),
        ]
        
        for ach in achievements:
            existing = db.query(Achievement).filter(Achievement.title == ach.title).first()
            if not existing:
                db.add(ach)
        
        quests = [
            Quest(title="Создатель", description="Создайте 1 цель", type="create_goal", target_count=1, xp_reward=20, gems_reward=10),
            Quest(title="Прогрессор", description="Обновите прогресс 3 раза", type="add_progress", target_count=3, xp_reward=30, gems_reward=15),
            Quest(title="Фокусировка", description="Завершите 2 помидора", type="pomodoro", target_count=2, xp_reward=25, gems_reward=10),
        ]
        
        for q in quests:
            existing = db.query(Quest).filter(Quest.title == q.title).first()
            if not existing:
                db.add(q)
        
        chests = [
            Chest(type="daily", name="Ежедневный сундук", min_gems=5, max_gems=20, min_xp=0, max_xp=0),
            Chest(type="weekly", name="Недельный сундук", min_gems=20, max_gems=50, min_xp=10, max_xp=50),
            Chest(type="streak", name="Сундук серии", min_gems=10, max_gems=30, min_xp=5, max_xp=25),
        ]
        
        for c in chests:
            existing = db.query(Chest).filter(Chest.name == c.name).first()
            if not existing:
                db.add(c)
        
        db.commit()
        
        test_user = db.query(User).filter(User.email == "daniil@example.com").first()
        
        if not test_user:
            new_user = User(
                email="daniil@example.com",
                hashed_password=get_password_hash("123456"),
                full_name="Даниил"
            )
            db.add(new_user)
            db.commit()
            print("Пользователь daniil@example.com добавлен!")
        else:
            print("Пользователь уже существует.")

if __name__ == "__main__":
    seed_data()
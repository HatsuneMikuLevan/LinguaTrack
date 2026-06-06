import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LogOut, Plus, Sparkles, Archive, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useGoals, useCreateGoal, useDeleteGoal } from '../hooks/useGoals';
import { useUser } from '../hooks/useUser';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';
import Stats from '../components/Stats';
import Achievements from '../components/Achievements';
import ThemeToggle from '../components/ThemeToggle';
import DeleteAccount from '../components/DeleteAccount';
import XPBar from '../components/XPBar';
import StreakBadge from '../components/StreakBadge';
import ActivityCalendar from '../components/ActivityCalendar';
import FocusTimer from '../components/FocusTimer';
import DailyTasks from '../components/DailyTasks';
import GemsLivesBar from '../components/GemsLivesBar';
import Mascot from '../components/Mascot';
import Vocabulary from '../components/Vocabulary';
import Friends from '../components/Friends';
import Quests from '../components/Quests';
import DoubleXP from '../components/DoubleXP';
import ProfileCard from '../components/ProfileCard';
import AvatarPicker from '../components/AvatarPicker';

const DashboardPage = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState('main');

  // React Query hooks
  const { data: goals = [], isLoading: goalsLoading } = useGoals(showArchived);
  const { data: user, refetch: refetchUser } = useUser();
  const createGoal = useCreateGoal();
  const deleteGoal = useDeleteGoal();

  const handleDelete = async (id) => {
    toast('Удалить эту цель?', {
      action: {
        label: 'Удалить',
        onClick: () => {
          deleteGoal.mutate(id, {
            onSuccess: () => toast.success('Цель удалена'),
            onError: () => toast.error('Ошибка удаления'),
          });
        },
      },
    });
  };

  const handleCreateGoal = (goalData) => {
    createGoal.mutate(goalData, {
      onSuccess: () => {
        toast.success('Цель создана!');
        setShowForm(false);
      },
      onError: (err) => toast.error(err.response?.data?.detail || 'Ошибка'),
    });
  };

  if (activeTab === 'vocab') {
    return (
      <div className="space-y-6 py-4">
        <button onClick={() => setActiveTab('main')} className="text-rose-400 hover:text-rose-600 text-sm flex items-center gap-2">
          ← Назад
        </button>
        <Vocabulary />
      </div>
    );
  }

  if (activeTab === 'friends') {
    return (
      <div className="space-y-6 py-4">
        <button onClick={() => setActiveTab('main')} className="text-rose-400 hover:text-rose-600 text-sm flex items-center gap-2">
          ← Назад
        </button>
        <Friends />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <ProfileCard user={user || authUser} goalsCount={goals.length} />
      <AvatarPicker currentColor={user?.avatar_color || authUser?.avatar_color} onUpdate={refetchUser} />
      <GemsLivesBar gems={user?.gems || authUser?.gems || 0} lives={user?.lives || authUser?.lives || 5} maxLives={user?.max_lives || authUser?.max_lives || 5} onUpdate={refetchUser} />

      <div className="flex justify-center">
        <Mascot name="Ушастик" level={user?.mascot_level || authUser?.mascot_level || 1} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <XPBar level={user?.level || authUser?.level || 1} xp={user?.xp || authUser?.xp || 0} />
        <StreakBadge streak={user?.streak || authUser?.streak || 0} />
      </div>

      <DoubleXP />

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setActiveTab('vocab')}
          className="p-4 bg-gradient-to-br from-rose-100 to-peach-100 rounded-2xl border border-rose-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl">
              <BookOpen className="w-5 h-5 text-rose-500" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-rose-800">Словарь</p>
              <p className="text-[10px] text-rose-400">Учите слова</p>
            </div>
          </div>
          <span className="text-rose-400">→</span>
        </button>

        <button onClick={() => setActiveTab('friends')}
          className="p-4 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl border border-sky-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl">
              <Users className="w-5 h-5 text-sky-500" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-sky-800">Друзья</p>
              <p className="text-[10px] text-sky-400">Соревнуйтесь</p>
            </div>
          </div>
          <span className="text-sky-400">→</span>
        </button>
      </div>

      <Quests />
      <Stats goals={goals} />
      <Achievements />
      <FocusTimer />
      <DailyTasks />
      <ActivityCalendar />

      <div className="flex items-center gap-3">
        <button onClick={() => setShowArchived(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${!showArchived ? 'bg-rose-400 text-white' : 'bg-white/50 text-rose-400'}`}>
          Активные
        </button>
        <button onClick={() => setShowArchived(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${showArchived ? 'bg-rose-400 text-white' : 'bg-white/50 text-rose-400'}`}>
          <Archive className="w-3 h-3" /> Архив
        </button>
      </div>

      {!showArchived && (
        <button onClick={() => setShowForm(true)}
          className="w-full py-4 border-2 border-dashed border-rose-200 rounded-2xl text-rose-400 text-sm font-bold hover:border-rose-400 hover:text-rose-600 transition-all flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> ДОБАВИТЬ НОВУЮ ЦЕЛЬ
        </button>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">
            {showArchived ? 'Архив' : 'Мои цели'}
          </h3>
        </div>

        {goalsLoading ? (
          <div className="text-center py-12 text-rose-400">
            <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Загрузка...
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12 bg-white/40 rounded-3xl border border-rose-100 border-dashed">
            <p className="text-rose-400 text-sm">{showArchived ? 'Архив пуст' : 'У вас пока нет активных целей'}</p>
            <p className="text-rose-300 text-xs mt-1">{showArchived ? '' : 'Создайте первую цель, чтобы начать'}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {goals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onUpdate={() => {}} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="pt-4 border-t border-rose-100 flex items-center justify-between">
        <ThemeToggle />
        <button onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-xl text-rose-400 hover:text-red-400 transition-colors text-xs font-bold">
          <LogOut className="w-4 h-4" /> Выйти
        </button>
      </div>

      <DeleteAccount />

      <AnimatePresence>
        {showForm && <GoalForm onSuccess={handleCreateGoal} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
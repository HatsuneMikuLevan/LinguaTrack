import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Gem, Zap, Target, Crown } from 'lucide-react';

const ProfileCard = ({ user, goalsCount }) => {
  if (!user) return null;

  const stats = [
    { icon: Zap, label: 'Уровень', value: user.level, color: 'text-amber-500' },
    { icon: Flame, label: 'Серия', value: `${user.streak} дней`, color: 'text-orange-500' },
    { icon: Gem, label: 'Гемы', value: user.gems, color: 'text-blue-500' },
    { icon: Target, label: 'Целей', value: goalsCount || 0, color: 'text-emerald-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-br from-rose-100/80 to-peach-100/80 rounded-3xl border border-rose-200 space-y-4"
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-20 h-20 rounded-3xl flex items-center justify-center font-black text-3xl text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${user.avatar_color}, ${user.avatar_color}dd)` }}
        >
          {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-black text-rose-900">{user.full_name || 'Пользователь'}</h2>
          <p className="text-sm text-rose-500">{user.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-600">{user.league || 'Бронза'} лига</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 bg-white/60 rounded-2xl flex items-center gap-3"
          >
            <div className={`p-2 bg-white rounded-xl ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-black text-rose-900">{stat.value}</p>
              <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 bg-white/40 rounded-2xl">
        <div className="flex justify-between text-xs text-rose-700 mb-1">
          <span>Опыт до следующего уровня</span>
          <span>{user.xp % 100} / 100 XP</span>
        </div>
        <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-rose-400 to-peach-400"
            initial={{ width: 0 }}
            animate={{ width: `${(user.xp % 100)}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
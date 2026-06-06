import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Target, Trophy, TrendingUp, Flag, Star } from 'lucide-react';

const iconMap = { Sparkles, Target, Trophy, TrendingUp, Flag, Star };

const AchievementCard = ({ achievement, index }) => {
  const Icon = iconMap[achievement.icon] || Sparkles;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`relative p-4 rounded-2xl border ${achievement.is_unlocked 
        ? 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200' 
        : 'bg-white/40 border-rose-100 opacity-60'}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${achievement.is_unlocked ? 'bg-teal-100' : 'bg-rose-50'}`}>
        <Icon className={`w-5 h-5 ${achievement.is_unlocked ? 'text-teal-600' : 'text-rose-300'}`} />
      </div>
      <h4 className={`text-xs font-bold mb-1 ${achievement.is_unlocked ? 'text-rose-900' : 'text-rose-300'}`}>
        {achievement.title}
      </h4>
      <p className="text-[10px] text-rose-500/70 leading-tight">{achievement.description}</p>
      {achievement.is_unlocked && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />}
      {!achievement.is_unlocked && <Lock className="absolute top-3 right-3 w-3 h-3 text-rose-300" />}
    </motion.div>
  );
};

export default AchievementCard;
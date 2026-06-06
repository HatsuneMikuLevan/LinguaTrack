
import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

const Stats = ({ goals }) => {
  const total = goals.length;
  const completed = goals.filter(g => g.progress >= g.target).length;
  const inProgress = total - completed;
  const totalProgress = goals.reduce((acc, g) => acc + Math.min(g.progress, g.target), 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const overallPercent = totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0;

  const stats = [
    { label: 'Всего целей', value: total, icon: Target, color: 'text-blue-500' },
    { label: 'Выполнено', value: completed, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'В процессе', value: inProgress, icon: Clock, color: 'text-amber-500' },
    { label: 'Общий прогресс', value: `${overallPercent}%`, icon: TrendingUp, color: 'text-teal-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 bg-white/60 rounded-2xl border border-rose-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">{stat.label}</span>
          </div>
          <p className="text-2xl font-black text-rose-900">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;
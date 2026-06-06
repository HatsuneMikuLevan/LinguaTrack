import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const XPBar = ({ level, xp }) => {
  const xpInLevel = xp - ((level - 1) * 100);
  const percent = Math.min(100, Math.round((xpInLevel / 100) * 100));
  
  return (
    <div className="p-4 bg-white/60 rounded-2xl border border-rose-100 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-rose-900">Уровень {level}</span>
        </div>
        <span className="text-[10px] text-rose-400">{xpInLevel} / 100 XP</span>
      </div>
      <div className="h-2 w-full bg-rose-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default XPBar;
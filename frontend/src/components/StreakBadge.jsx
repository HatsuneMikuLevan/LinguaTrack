import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const StreakBadge = ({ streak }) => {
  if (streak <= 0) return null;
  
  return (
    <motion.div 
      initial={{ scale: 0 }} 
      animate={{ scale: 1 }}
      className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-xl"
    >
      <Flame className={`w-5 h-5 ${streak >= 3 ? 'text-orange-500' : 'text-rose-300'}`} />
      <div>
        <span className="text-sm font-black text-rose-900">{streak}</span>
        <span className="text-[10px] text-rose-400 ml-1">дней подряд</span>
      </div>
    </motion.div>
  );
};

export default StreakBadge;
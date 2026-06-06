import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Timer } from 'lucide-react';
import { toast } from 'sonner';

const DoubleXP = () => {
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setActive(false);
          return 900;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const activate = () => {
    setActive(true);
    setTimeLeft(900);
    toast.success('Двойной XP активирован на 15 минут! ⚡');
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (active) {
    return (
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-yellow-700">Двойной XP!</p>
              <p className="text-[10px] text-rose-400">Все действия ×2</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-600">
            <Timer className="w-4 h-4" />
            <span className="text-sm font-black">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <button 
      onClick={activate}
      className="w-full p-4 bg-white/60 rounded-2xl border border-rose-100 hover:border-yellow-300 transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-50 rounded-xl group-hover:bg-yellow-100 transition-colors">
          <Zap className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-rose-900">Двойной XP</p>
          <p className="text-[10px] text-rose-400">15 минут ускорения</p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">БЕСПЛАТНО</span>
    </button>
  );
};

export default DoubleXP;
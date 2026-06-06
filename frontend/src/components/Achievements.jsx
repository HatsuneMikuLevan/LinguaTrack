import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../lib/api';
import AchievementCard from './AchievementCard';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAchievements = async () => {
    try {
      const res = await api.get('/achievements');
      setAchievements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const unlockedCount = achievements.filter(a => a.is_unlocked).length;

  return (
    <div className="space-y-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-rose-100 hover:border-teal-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-teal-500" />
          <div className="text-left">
            <h3 className="text-sm font-bold text-rose-900">Достижения</h3>
            <p className="text-[10px] text-rose-400">{unlockedCount} из {achievements.length} разблокировано</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-rose-400" /> : <ChevronDown className="w-4 h-4 text-rose-400" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-2 gap-3 pb-2">
              {achievements.map((ach, i) => (
                <AchievementCard key={ach.id} achievement={ach} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
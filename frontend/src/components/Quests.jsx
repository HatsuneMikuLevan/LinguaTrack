import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Gem, Zap } from 'lucide-react';
import api from '../lib/api';

const Quests = () => {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    api.get('/quests').then(res => setQuests(res.data));
  }, []);

  return (
    <div className="p-4 bg-white/60 rounded-2xl border border-rose-100 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-teal-500" />
        <h4 className="text-xs font-bold text-rose-900">Ежедневные квесты</h4>
      </div>

      {quests.map((quest, i) => (
        <motion.div
          key={quest.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`p-3 rounded-xl ${quest.is_completed ? 'bg-emerald-50 border border-emerald-200' : 'bg-white/40'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-900">{quest.title}</span>
            {quest.is_completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <span className="text-[10px] text-rose-400">{quest.progress}/{quest.target_count}</span>
            )}
          </div>
          <p className="text-[10px] text-rose-500/70 mb-2">{quest.description}</p>
          
          {!quest.is_completed && (
            <div className="h-1.5 w-full bg-rose-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${(quest.progress / quest.target_count) * 100}%` }}
              />
            </div>
          )}
          
          <div className="flex gap-3 mt-2 text-[10px] text-rose-400">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> {quest.xp_reward} XP</span>
            <span className="flex items-center gap-1"><Gem className="w-3 h-3 text-blue-500" /> {quest.gems_reward}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Quests;
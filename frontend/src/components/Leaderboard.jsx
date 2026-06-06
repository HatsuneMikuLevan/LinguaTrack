import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown } from 'lucide-react';
import api from '../lib/api';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    api.get('/leaderboard').then(res => setLeaders(res.data));
  }, []);

  return (
    <div className="p-4 bg-white/60 rounded-2xl border border-rose-100 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <h4 className="text-xs font-bold text-rose-900">Турнирная таблица</h4>
      </div>

      <div className="space-y-2">
        {leaders.slice(0, 10).map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl ${entry.is_me ? 'bg-teal-50 border border-teal-200' : 'bg-white/40 border border-rose-100'}`}
          >
            <div className="w-6 text-center">
              {i === 0 ? <Crown className="w-5 h-5 text-yellow-500" /> : 
               i === 1 ? <span className="text-sm font-bold text-rose-400">2</span> :
               i === 2 ? <span className="text-sm font-bold text-amber-500">3</span> :
               <span className="text-xs text-rose-300">{i + 1}</span>}
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: entry.avatar_color }}>
              {entry.name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-rose-900">{entry.name} {entry.is_me && '(Вы)'}</p>
              <p className="text-[10px] text-rose-400">Уровень {entry.level}</p>
            </div>
            <span className="text-xs font-black text-teal-600">{entry.xp} XP</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
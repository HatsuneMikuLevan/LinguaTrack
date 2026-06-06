import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, UserPlus, Trophy, Mail, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [email, setEmail] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchData = async () => {
    try {
      const [friendsRes, leadersRes] = await Promise.all([
        api.get('/friends'),
        api.get('/friends/leaderboard')
      ]);
      setFriends(friendsRes.data);
      setLeaderboard(leadersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addFriend = async (e) => {
    e.preventDefault();
    try {
      await api.post('/friends/request', { friend_email: email });
      toast.success('Заявка отправлена! 📨');
      setEmail('');
      setShowAdd(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-rose-900">Друзья</h3>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 bg-rose-400 text-white rounded-xl hover:bg-rose-300 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={addFriend}
            className="overflow-hidden space-y-2"
          >
            <div className="flex gap-2">
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email друга..."
                className="flex-1 p-3 bg-white/50 border border-rose-200 rounded-xl text-sm text-rose-900 focus:border-rose-400 outline-none placeholder-rose-300"
                required
              />
              <button type="submit" className="p-3 bg-rose-400 text-white rounded-xl">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {friends.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Мои друзья</h4>
          {friends.map(friend => (
            <motion.div 
              key={friend.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl border border-rose-100"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
                style={{ background: friend.friend_avatar }}
              >
                {friend.friend_name[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-900">{friend.friend_name}</p>
                <p className="text-[10px] text-rose-400">Уровень {friend.friend_level}</p>
              </div>
              <Trophy className="w-4 h-4 text-amber-400" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">🏆 Турнирная таблица</h4>
        {leaderboard.slice(0, 10).map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl ${entry.is_me ? 'bg-rose-100 border border-rose-300' : 'bg-white/40 border border-rose-100'}`}
          >
            <div className="w-6 text-center font-black text-rose-400">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
            </div>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: entry.avatar_color }}
            >
              {entry.name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-rose-900">{entry.name} {entry.is_me && '(Вы)'}</p>
            </div>
            <span className="text-xs font-black text-rose-500">{entry.xp} XP</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
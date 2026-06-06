import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';

const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [todayCount, setTodayCount] = useState(0);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    api.get('/pomodoro/today').then(res => {
      setTodayCount(res.data.filter(s => s.is_completed).length);
    });
  }, []);
  
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);
  
  const start = async () => {
    try {
      const res = await api.post('/pomodoro/start', { duration_minutes: 25 });
      setSessionId(res.data.id);
      setIsRunning(true);
      toast.success('Фокус-таймер запущен! Сконцентрируйтесь... 🎯');
    } catch (err) {
      toast.error('Ошибка запуска');
    }
  };
  
  const pause = () => setIsRunning(false);
  
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setSessionId(null);
  };
  
  const handleComplete = async () => {
    setIsRunning(false);
    if (sessionId) {
      try {
        await api.post('/pomodoro/end', { session_id: sessionId, is_completed: true });
        setTodayCount(c => c + 1);
        toast.success('Фокус-сессия завершена! +15 XP ✨');
        setSessionId(null);
      } catch (err) {
        toast.error('Ошибка сохранения');
      }
    }
    setTimeLeft(25 * 60);
  };
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  const percent = ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  
  return (
    <div className="p-4 bg-white/60 rounded-2xl border border-rose-100 text-center space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <h4 className="text-xs font-bold text-rose-800">Фокус-таймер</h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-rose-400">
          <CheckCircle2 className="w-3 h-3" />
          {todayCount} сегодня
        </div>
      </div>
      
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-rose-100" />
          <motion.circle 
            cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent"
            strokeDasharray={365} strokeDashoffset={365 - (365 * percent) / 100}
            strokeLinecap="round" className="text-rose-400"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-rose-800">{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <button onClick={start} className="p-3 bg-rose-400 rounded-xl text-white hover:bg-rose-300 transition-colors">
            <Play className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={pause} className="p-3 bg-amber-400 rounded-xl text-white hover:bg-amber-300 transition-colors">
            <Pause className="w-5 h-5" />
          </button>
        )}
        <button onClick={reset} className="p-3 bg-white/50 rounded-xl text-rose-400 hover:bg-white transition-colors border border-rose-100">
          <RotateCcw className="w-5 h-5" />
        </button>
        {timeLeft < 25 * 60 && (
          <button onClick={handleComplete} className="p-3 bg-emerald-400 rounded-xl text-white hover:bg-emerald-300 transition-colors">
            <CheckCircle2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FocusTimer;
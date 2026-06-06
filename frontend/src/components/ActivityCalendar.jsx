import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import api from '../lib/api';

const ActivityCalendar = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    api.get('/activity').then(res => setData(res.data));
  }, []);
  
  const getColor = (count) => {
    if (count === 0) return 'bg-rose-100/50';
    if (count === 1) return 'bg-teal-200';
    if (count <= 3) return 'bg-teal-300';
    if (count <= 5) return 'bg-teal-400';
    return 'bg-teal-500';
  };
  
  const recent = data.slice(-84);
  
  return (
    <div className="p-4 bg-white/60 rounded-2xl border border-rose-100">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-4 h-4 text-teal-500" />
        <h4 className="text-xs font-bold text-rose-900">Активность за 12 недель</h4>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {recent.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.01 }}
            className={`aspect-square rounded-sm ${getColor(day.count)}`}
            title={`${day.date}: ${day.count} активностей`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 text-[10px] text-rose-400">
        <span>Меньше</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-rose-100/50" />
          <div className="w-3 h-3 rounded-sm bg-teal-200" />
          <div className="w-3 h-3 rounded-sm bg-teal-300" />
          <div className="w-3 h-3 rounded-sm bg-teal-400" />
          <div className="w-3 h-3 rounded-sm bg-teal-500" />
        </div>
        <span>Больше</span>
      </div>
    </div>
  );
};

export default ActivityCalendar;
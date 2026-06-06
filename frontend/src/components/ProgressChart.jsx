import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/api';

const ProgressChart = ({ goalId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!goalId) return;
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/goals/${goalId}/history`);
        const grouped = {};
        res.data.forEach(log => {
          const date = format(new Date(log.logged_at), 'dd.MM');
          grouped[date] = { date, progress: log.new_progress };
        });
        setData(Object.values(grouped).reverse().slice(-7));
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [goalId]);

  if (data.length < 2) return null;

  return (
    <div className="p-4 bg-white/60 rounded-2xl border border-rose-100 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-teal-500" />
        <h4 className="text-xs font-bold text-rose-900">Динамика прогресса</h4>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis dataKey="date" stroke="#fda4af" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#fda4af" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', fontSize: '12px' }}
            itemStyle={{ color: '#0d9488' }}
          />
          <Area type="monotone" dataKey="progress" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorProgress)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
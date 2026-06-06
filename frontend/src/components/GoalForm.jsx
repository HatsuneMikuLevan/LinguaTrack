import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';

const GoalForm = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({
    title: '', category: 'Vocabulary', description: '', target: 100, deadline: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'Vocabulary', label: 'Словарный запас' },
    { value: 'Grammar', label: 'Грамматика' },
    { value: 'Listening', label: 'Аудирование' },
    { value: 'Speaking', label: 'Говорение' },
    { value: 'Reading', label: 'Чтение' },
    { value: 'Writing', label: 'Письмо' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/goals', {
        ...form,
        target: Number(form.target),
        deadline: form.deadline || null
      });
      toast.success('Цель создана!');
      onSuccess(response.data);  // ← передаём данные новой цели вверх
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка создания цели');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()} className="bg-white/90 backdrop-blur-xl border border-rose-100 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-rose-900">Новая цель</h2>
          <button onClick={onClose} className="p-2 hover:bg-rose-100 rounded-full transition-colors"><X className="w-5 h-5 text-rose-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Название</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-900 focus:border-teal-500 outline-none placeholder-rose-300" placeholder="Например: Выучить 1000 слов" />
          </div>

          <div>
            <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Категория</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-900 focus:border-teal-500 outline-none">
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Описание</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-900 focus:border-teal-500 outline-none h-24 resize-none placeholder-rose-300" placeholder="Дополнительные детали..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Цель (число)</label>
              <input type="number" min="1" required value={form.target} onChange={e => setForm({...form, target: e.target.value})}
                className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-900 focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Дедлайн</label>
              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}
                className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-900 focus:border-teal-500 outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 mt-4">
            {loading ? 'Создание...' : 'Создать цель'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GoalForm;
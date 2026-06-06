import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';

const DailyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  
  const fetchTasks = async () => {
    try {
      const res = await api.get('/daily-tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.post('/daily-tasks', { title: newTitle });
      setNewTitle('');
      setShowInput(false);
      fetchTasks();
      toast.success('Задача добавлена');
    } catch (err) {
      toast.error('Ошибка');
    }
  };
  
  const toggle = async (id) => {
    try {
      await api.patch(`/daily-tasks/${id}/toggle`);
      fetchTasks();
    } catch (err) {
      toast.error('Ошибка');
    }
  };
  
  const remove = async (id) => {
    try {
      await api.delete(`/daily-tasks/${id}`);
      fetchTasks();
    } catch (err) {
      toast.error('Ошибка');
    }
  };
  
  const completedCount = tasks.filter(t => t.is_completed).length;
  
  return (
    <div className="p-4 bg-white/60 rounded-2xl border border-rose-100 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-teal-500" />
          <h4 className="text-xs font-bold text-rose-900">Ежедневные задачи</h4>
        </div>
        <span className="text-[10px] text-rose-400">{completedCount}/{tasks.length}</span>
      </div>
      
      <AnimatePresence>
        {tasks.map(task => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-3 p-3 bg-white/40 rounded-xl border border-rose-100 group"
          >
            <button 
              onClick={() => toggle(task.id)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${task.is_completed ? 'bg-teal-500 border-teal-500' : 'border-rose-200 hover:border-teal-500'}`}
            >
              {task.is_completed && <Check className="w-3 h-3 text-white" />}
            </button>
            <span className={`text-xs flex-1 ${task.is_completed ? 'text-rose-300 line-through' : 'text-rose-900'}`}>{task.title}</span>
            <button onClick={() => remove(task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-rose-300 hover:text-red-500 transition-all">
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {showInput ? (
        <form onSubmit={addTask} className="flex gap-2">
          <input 
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="flex-1 p-2 bg-white/50 border border-rose-200 rounded-xl text-xs text-rose-900 focus:border-teal-500 outline-none placeholder-rose-300"
            placeholder="Новая задача..."
          />
          <button type="submit" className="p-2 bg-teal-500 rounded-xl text-white hover:bg-teal-400">
            <Plus className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <button onClick={() => setShowInput(true)} className="w-full py-2 border border-dashed border-rose-200 rounded-xl text-rose-400 text-xs hover:border-teal-300 hover:text-teal-500 transition-colors">
          + Добавить задачу
        </button>
      )}
    </div>
  );
};

export default DailyTasks;
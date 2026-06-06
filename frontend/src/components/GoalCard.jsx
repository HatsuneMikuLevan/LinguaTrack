import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trash2, Edit2, Plus, Minus, Calendar, Archive, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';
import ProgressRing from './ProgressRing';
import ProgressChart from './ProgressChart';
import { getCategoryStyle } from '../lib/categoryColors';
import api from '../lib/api';

const GoalCard = ({ goal, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');
  const [editData, setEditData] = useState({ ...goal });

  const percent = Math.min(100, Math.round((goal.progress / goal.target) * 100));
  const isCompleted = goal.progress >= goal.target;
  const catStyle = getCategoryStyle(goal.category);

  const handleProgress = async (delta) => {
    const newProgress = Math.max(0, Math.min(goal.target, goal.progress + delta));
    
    if (delta > 0 && !showNoteInput) {
      setShowNoteInput(true);
      return;
    }
    
    try {
      await api.patch(`/goals/${goal.id}/progress`, { 
        progress: newProgress,
        note: note || null
      });
      if (newProgress === goal.target && delta > 0) {
        toast.success(`Цель "${goal.title}" выполнена! 🎉 +105 XP`);
      } else {
        toast.success(`Прогресс обновлён! +5 XP`);
      }
      setNote('');
      setShowNoteInput(false);
      onUpdate();
    } catch (err) {
      toast.error('Ошибка обновления прогресса');
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/goals/${goal.id}`, editData);
      setIsEditing(false);
      toast.success('Цель обновлена');
      onUpdate();
    } catch (err) {
      toast.error('Ошибка сохранения');
    }
  };

  const handleArchive = async () => {
    try {
      await api.post(`/goals/${goal.id}/archive`);
      toast.success(goal.is_archived ? 'Цель восстановлена' : 'Цель в архиве');
      onUpdate();
    } catch (err) {
      toast.error('Ошибка');
    }
  };

  if (isEditing) {
    return (
      <motion.div layout className="p-6 bg-white/60 rounded-3xl border border-rose-100 space-y-4">
        <input
          value={editData.title}
          onChange={e => setEditData({...editData, title: e.target.value})}
          className="w-full bg-white/50 border border-rose-200 rounded-xl p-3 text-rose-900 focus:border-rose-400 outline-none"
        />
        <div className="flex gap-2">
          <button onClick={handleSave} className="flex-1 bg-teal-500 text-white py-2 rounded-xl font-bold hover:bg-teal-400">Сохранить</button>
          <button onClick={() => setIsEditing(false)} className="flex-1 bg-rose-100 text-rose-700 py-2 rounded-xl hover:bg-rose-200">Отмена</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`p-6 bg-white/60 rounded-3xl border ${isCompleted ? 'border-teal-300' : 'border-rose-100'} relative overflow-hidden`}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3 text-[10px] font-black text-teal-600 bg-teal-100 px-2 py-1 rounded-full uppercase tracking-wider">Выполнено</div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className={`inline-flex items-center gap-2 mb-2 px-2 py-1 rounded-lg ${catStyle.bg} border ${catStyle.border}`}>
            <Target className={`w-3 h-3 ${catStyle.text}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${catStyle.text}`}>{goal.category}</span>
          </div>
          <h3 className="text-lg font-bold text-rose-900 mb-1">{goal.title}</h3>
          {goal.description && <p className="text-xs text-rose-500/70 mb-2">{goal.description}</p>}
          {goal.deadline && (
            <div className="flex items-center gap-1 text-[10px] text-rose-400">
              <Calendar className="w-3 h-3" />
              {format(new Date(goal.deadline), 'dd MMM yyyy', { locale: ru })}
            </div>
          )}
        </div>
        <ProgressRing progress={goal.progress} target={goal.target} size={56} />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs text-rose-500/70">
          <span>{goal.progress} / {goal.target}</span>
          <span className="font-bold text-teal-600">{percent}%</span>
        </div>
        
        <div className="h-2 w-full bg-rose-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${catStyle.gradient}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <AnimatePresence>
          {showNoteInput && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex gap-2 pt-2">
                <input 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Заметка (необязательно)..."
                  className="flex-1 p-2 bg-white/50 border border-rose-200 rounded-xl text-xs text-rose-900 focus:border-teal-500 outline-none placeholder-rose-300"
                />
                <button onClick={() => handleProgress(1)} className="p-2 bg-teal-500 rounded-xl text-white text-xs font-bold hover:bg-teal-400">OK</button>
                <button onClick={() => setShowNoteInput(false)} className="p-2 bg-rose-100 rounded-xl text-rose-500 text-xs hover:bg-rose-200">Отмена</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => handleProgress(-1)}
            className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors disabled:opacity-30"
            disabled={goal.progress <= 0}
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => { if (!showNoteInput) { setShowNoteInput(true); } else { handleProgress(1); } }}
            className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors disabled:opacity-30"
            disabled={goal.progress >= goal.target}
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <button onClick={() => setShowChart(!showChart)} 
            className="text-[10px] font-bold text-rose-400 hover:text-teal-600 transition-colors px-2 flex items-center gap-1">
            {showChart ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            График
          </button>
          <button onClick={handleArchive} className="p-2 text-rose-400 hover:text-amber-500 transition-colors" title="Архив">
            <Archive className="w-4 h-4" />
          </button>
          <button onClick={() => setIsEditing(true)} className="p-2 text-rose-400 hover:text-rose-700 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(goal.id)} className="p-2 text-rose-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showChart && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
          <ProgressChart goalId={goal.id} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default GoalCard;
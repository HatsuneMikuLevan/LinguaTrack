import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';

const colors = [
  '#f472b6', '#fb7185', '#fda4af', '#f9a8d4', // розовые
  '#fdba74', '#fb923c', '#fcd34d', '#fbbf24', // персиковые/жёлтые
  '#a7f3d0', '#6ee7b7', '#99f6e4', '#5eead4', // мятные
  '#bae6fd', '#7dd3fc', '#c4b5fd', '#a78bfa', // голубые/фиолетовые
  '#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', // нейтральные
];

const AvatarPicker = ({ currentColor, onUpdate }) => {
  const [selected, setSelected] = useState(currentColor);
  const [isOpen, setIsOpen] = useState(false);

  const save = async () => {
    try {
      await api.patch('/me', { avatar_color: selected });
      toast.success('Аватар обновлён! 🎨');
      onUpdate();
      setIsOpen(false);
    } catch (err) {
      toast.error('Ошибка сохранения');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded-xl text-xs font-bold text-rose-700 hover:bg-white transition-colors"
      >
        <Palette className="w-4 h-4" /> Сменить аватар
      </button>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-white/80 rounded-2xl border border-rose-100 space-y-3"
    >
      <p className="text-xs font-bold text-rose-800">Выберите цвет:</p>
      <div className="grid grid-cols-4 gap-2">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => setSelected(color)}
            className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${selected === color ? 'ring-2 ring-offset-2 ring-rose-400' : ''}`}
            style={{ background: color }}
          >
            {selected === color && <Check className="w-5 h-5 text-white mx-auto" />}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={save} className="flex-1 py-2 bg-rose-400 text-white rounded-xl text-xs font-bold">Сохранить</button>
        <button onClick={() => setIsOpen(false)} className="flex-1 py-2 bg-white/50 text-rose-700 rounded-xl text-xs font-bold">Отмена</button>
      </div>
    </motion.div>
  );
};

export default AvatarPicker;

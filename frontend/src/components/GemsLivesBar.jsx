import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Heart, Plus } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';

const GemsLivesBar = ({ gems, lives, maxLives, onUpdate }) => {
  const buyLives = async () => {
    try {
      const res = await api.post('/shop/lives/buy');
      toast.success(`Жизни восстановлены! ${res.data.lives}/${maxLives}`);
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl">
        <Gem className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-bold text-rose-900">{gems}</span>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex gap-0.5">
          {[...Array(maxLives)].map((_, i) => (
            <Heart key={i} className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-red-500' : 'text-rose-200'}`} />
          ))}
        </div>
        {lives < maxLives && (
          <button onClick={buyLives} className="ml-1 p-1 hover:bg-white rounded transition-colors">
            <Plus className="w-3 h-3 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GemsLivesBar;
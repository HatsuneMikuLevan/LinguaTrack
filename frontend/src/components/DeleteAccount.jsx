import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { toast } from 'sonner';

const DeleteAccount = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    if (confirmText !== 'УДАЛИТЬ') {
      toast.error('Введите УДАЛИТЬ для подтверждения');
      return;
    }
    try {
      await api.delete('/me');
      toast.success('Аккаунт удален');
      logout();
      navigate('/');
    } catch (err) {
      toast.error('Ошибка удаления аккаунта');
    }
  };

  return (
    <>
      <button onClick={() => setShowConfirm(true)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-colors text-xs font-bold">
        <Trash2 className="w-4 h-4" /> Удалить аккаунт
      </button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirm(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()} className="bg-white/90 backdrop-blur-xl border border-rose-100 rounded-3xl p-8 w-full max-w-sm">
              <div className="flex items-center gap-3 mb-4 text-red-500">
                <AlertTriangle className="w-8 h-8" />
                <h3 className="text-lg font-bold text-rose-900">Удаление аккаунта</h3>
              </div>
              <p className="text-sm text-rose-600 mb-6">
                Все данные будут удалены. Введите <span className="text-rose-900 font-bold">УДАЛИТЬ</span> для подтверждения.
              </p>
              <input value={confirmText} onChange={e => setConfirmText(e.target.value)}
                className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-900 mb-4 focus:border-red-400 outline-none placeholder-rose-300"
                placeholder="УДАЛИТЬ" />
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-rose-100 rounded-xl text-rose-700 font-bold hover:bg-rose-200">Отмена</button>
                <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 rounded-xl text-white font-bold hover:bg-red-600">Удалить</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeleteAccount;
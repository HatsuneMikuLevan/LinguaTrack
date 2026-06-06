import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'sonner';

const ForgotPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [secretWord, setSecretWord] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email, secret_word: secretWord, new_password: newPassword });
      toast.success('Пароль изменен! Войдите с новым паролем.');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            onClick={e => e.stopPropagation()} className="bg-white/90 backdrop-blur-xl border border-rose-100 rounded-3xl p-8 w-full max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-bold text-rose-900">Сброс пароля</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-rose-100 rounded-full"><X className="w-4 h-4 text-rose-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-900 focus:border-teal-500 outline-none placeholder-rose-300" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Секретное слово</label>
                <input type="text" required value={secretWord} onChange={e => setSecretWord(e.target.value)}
                  className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-900 focus:border-teal-500 outline-none placeholder-rose-300" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Новый пароль</label>
                <input type="password" required minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-900 focus:border-teal-500 outline-none placeholder-rose-300" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-4 rounded-2xl disabled:opacity-50">
                {loading ? 'Сохранение...' : 'Изменить пароль'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPassword;
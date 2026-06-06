import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import api from '../lib/api';
import ForgotPassword from '../components/ForgotPassword';
import PageTransition from '../components/PageTransition';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await api.post('/auth/register', { email, password, full_name: fullName });
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        const me = await api.get('/auth/me');
        login(res.data.access_token, me.data);
        toast.success('Добро пожаловать! 🎉');
        navigate('/dashboard');
      } else {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        const me = await api.get('/auth/me');
        login(res.data.access_token, me.data);
        toast.success('С возвращением! ✨');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="py-4">
        <motion.button 
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')} 
          className="mb-6 text-rose-400 hover:text-rose-600 flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-rose-400" />
          </motion.div>
          <h2 className="text-2xl font-black text-rose-900 mb-2">
            {isRegistering ? 'Создать аккаунт' : 'С возвращением'}
          </h2>
          <p className="text-rose-400 text-sm">
            {isRegistering ? 'Начните свой путь к английскому' : 'Войдите, чтобы продолжить обучение'}
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="space-y-5"
        >
          {isRegistering && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-1"
            >
              <label className="block text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Имя</label>
              <input 
                value={fullName} 
                onChange={e => setFullName(e.target.value)}
                className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-800 focus:border-rose-400 outline-none transition-all placeholder-rose-300"
                placeholder="Иван Иванов" 
              />
            </motion.div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-800 focus:border-rose-400 outline-none transition-all placeholder-rose-300"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 bg-white/50 border border-rose-200 rounded-2xl text-rose-800 focus:border-rose-400 outline-none transition-all placeholder-rose-300"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-400 to-peach-400 text-white font-black py-4 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isRegistering ? 'ЗАРЕГИСТРИРОВАТЬСЯ' : 'ВОЙТИ'}
          </motion.button>

          {!isRegistering && (
            <div className="text-center">
              <button type="button" onClick={() => setShowForgot(true)}
                className="text-rose-400 text-xs hover:text-rose-600 transition-colors">Забыли пароль?</button>
            </div>
          )}

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-rose-400 text-xs font-bold hover:text-rose-600 transition-colors"
            >
              {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Создать'}
            </button>
          </div>
        </motion.form>

        <ForgotPassword isOpen={showForgot} onClose={() => setShowForgot(false)} />
      </div>
    </PageTransition>
  );
};

export default LoginPage;
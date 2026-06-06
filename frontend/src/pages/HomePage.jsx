import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, Trophy, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: BookOpen, title: 'Учите слова', desc: 'Личный словарь с системой повторения' },
    { icon: Brain, title: 'Фокус-таймер', desc: '25 минут концентрации = результат' },
    { icon: Trophy, title: 'Соревнуйтесь', desc: 'Друзья, лиги, достижения' },
  ];

  return (
    <PageTransition>
      <div className="text-center space-y-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            Умный трекер английского
          </motion.div>
          
          <h2 className="text-3xl font-black text-rose-900 leading-tight">
            Достигайте языковых<br />
            <span className="bg-gradient-to-r from-rose-400 to-peach-400 bg-clip-text text-transparent">целей каждый день</span>
          </h2>
          <p className="text-rose-400 max-w-sm mx-auto text-sm">
            Структурируйте обучение, отслеживайте прогресс и достигайте новых высот в изучении английского языка.
          </p>
        </motion.div>

        <div className="space-y-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15, type: "spring" }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-rose-100 text-left backdrop-blur-sm"
            >
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-3 bg-gradient-to-br from-rose-100 to-peach-100 rounded-xl"
              >
                <f.icon className="w-5 h-5 text-rose-500" />
              </motion.div>
              <div>
                <h3 className="text-sm font-bold text-rose-800">{f.title}</h3>
                <p className="text-xs text-rose-400">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          className="w-full bg-gradient-to-r from-rose-400 to-peach-400 text-white font-bold py-5 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
        >
          Начать обучение
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>
    </PageTransition>
  );
};

export default HomePage;
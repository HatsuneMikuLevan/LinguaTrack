import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash2, Brain, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';

const Vocabulary = () => {
  const [words, setWords] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newWord, setNewWord] = useState({ word: '', translation: '', example: '' });
  const [studyMode, setStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchWords = async () => {
    try {
      const res = await api.get('/vocabulary');
      setWords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const addWord = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vocabulary', newWord);
      setNewWord({ word: '', translation: '', example: '' });
      setShowAdd(false);
      fetchWords();
      toast.success('Слово добавлено! +5 XP');
    } catch (err) {
      toast.error('Ошибка');
    }
  };

  const deleteWord = async (id) => {
    try {
      await api.delete(`/vocabulary/${id}`);
      fetchWords();
      toast.success('Слово удалено');
    } catch (err) {
      toast.error('Ошибка');
    }
  };

  const review = async (id, correct) => {
    try {
      await api.patch(`/vocabulary/${id}/review?is_correct=${correct}`);
      toast.success(correct ? 'Правильно! +3 XP' : 'Повторим позже');
      setShowAnswer(false);
      setCurrentIndex(i => i + 1);
    } catch (err) {
      toast.error('Ошибка');
    }
  };

  const toReview = words.filter(w => new Date(w.next_review) <= new Date());
  const levels = ['Новое', 'Изучаю', 'Знаю', 'Мастер'];

  if (studyMode && toReview.length > 0) {
    const current = toReview[currentIndex];
    if (!current || currentIndex >= toReview.length) {
      setStudyMode(false);
      setCurrentIndex(0);
      return <div className="text-center py-8 text-rose-900">Повторение завершено!</div>;
    }

    return (
      <div className="p-6 bg-white/60 rounded-3xl border border-rose-100 text-center space-y-6">
        <h3 className="text-xl font-black text-rose-900">{current.word}</h3>
        {current.example && <p className="text-sm text-rose-500/70 italic">"{current.example}"</p>}
        
        <AnimatePresence>
          {showAnswer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <p className="text-lg text-teal-600 font-bold">{current.translation}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => review(current.id, false)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100">
                  <XCircle className="w-6 h-6" />
                </button>
                <button onClick={() => review(current.id, true)} className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-100">
                  <CheckCircle className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showAnswer && (
          <button onClick={() => setShowAnswer(true)} className="px-6 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-400">
            Показать перевод
          </button>
        )}
        
        <p className="text-xs text-rose-400">{currentIndex + 1} / {toReview.length}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-500" />
          <h4 className="text-xs font-bold text-rose-900">Словарь ({words.length})</h4>
        </div>
        <div className="flex gap-2">
          {toReview.length > 0 && (
            <button onClick={() => setStudyMode(true)} className="flex items-center gap-1 px-3 py-2 bg-purple-50 text-purple-500 rounded-xl text-xs font-bold hover:bg-purple-100">
              <Brain className="w-3 h-3" /> Повторить ({toReview.length})
            </button>
          )}
          <button onClick={() => setShowAdd(!showAdd)} className="p-2 bg-white/60 rounded-xl text-teal-500 border border-rose-100 hover:border-teal-300">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={addWord} className="space-y-2">
          <input value={newWord.word} onChange={e => setNewWord({...newWord, word: e.target.value})}
            placeholder="Слово" className="w-full p-3 bg-white/50 border border-rose-200 rounded-xl text-rose-900 text-xs focus:border-teal-500 outline-none placeholder-rose-300" required />
          <input value={newWord.translation} onChange={e => setNewWord({...newWord, translation: e.target.value})}
            placeholder="Перевод" className="w-full p-3 bg-white/50 border border-rose-200 rounded-xl text-rose-900 text-xs focus:border-teal-500 outline-none placeholder-rose-300" required />
          <input value={newWord.example} onChange={e => setNewWord({...newWord, example: e.target.value})}
            placeholder="Пример (необязательно)" className="w-full p-3 bg-white/50 border border-rose-200 rounded-xl text-rose-900 text-xs focus:border-teal-500 outline-none placeholder-rose-300" />
          <button type="submit" className="w-full py-2 bg-teal-500 text-white rounded-xl text-xs font-bold hover:bg-teal-400">Добавить</button>
        </form>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {words.map(word => (
          <div key={word.id} className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-rose-100">
            <div>
              <p className="text-xs font-bold text-rose-900">{word.word}</p>
              <p className="text-[10px] text-rose-500/70">{word.translation}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-1 rounded ${['bg-gray-100 text-gray-600','bg-blue-50 text-blue-500','bg-emerald-50 text-emerald-500','bg-amber-50 text-amber-500'][word.level]}`}>
                {levels[word.level]}
              </span>
              <button onClick={() => deleteWord(word.id)} className="p-1 text-rose-300 hover:text-red-500">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vocabulary;
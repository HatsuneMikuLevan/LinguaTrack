import React from 'react';
import { motion } from 'framer-motion';

const Mascot = ({ name, level }) => {
  return (
    <motion.div 
      initial={{ y: 10 }}
      animate={{ y: [10, -5, 10] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="flex flex-col items-center gap-2"
    >
      {/* Ушастик - милый зайка */}
      <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-lg">
        {/* Уши */}
        <ellipse cx="40" cy="35" rx="12" ry="28" fill="#f9a8d4" transform="rotate(-15 40 35)" />
        <ellipse cx="40" cy="35" rx="7" ry="20" fill="#fce7f3" transform="rotate(-15 40 35)" />
        <ellipse cx="80" cy="35" rx="12" ry="28" fill="#f9a8d4" transform="rotate(15 80 35)" />
        <ellipse cx="80" cy="35" rx="7" ry="20" fill="#fce7f3" transform="rotate(15 80 35)" />
        
        {/* Голова */}
        <circle cx="60" cy="70" r="35" fill="#fbcfe8" />
        
        {/* Глаза */}
        <circle cx="48" cy="65" r="5" fill="#374151" />
        <circle cx="72" cy="65" r="5" fill="#374151" />
        <circle cx="49" cy="63" r="2" fill="white" />
        <circle cx="73" cy="63" r="2" fill="white" />
        
        {/* Нос */}
        <ellipse cx="60" cy="75" rx="4" ry="3" fill="#f472b6" />
        
        {/* Рот */}
        <path d="M55 82 Q60 87 65 82" stroke="#f472b6" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Румянец */}
        <circle cx="42" cy="75" r="5" fill="#f9a8d4" opacity="0.6" />
        <circle cx="78" cy="75" r="5" fill="#f9a8d4" opacity="0.6" />
        
        {/* Лапки */}
        <ellipse cx="45" cy="105" rx="8" ry="6" fill="#fbcfe8" />
        <ellipse cx="75" cy="105" rx="8" ry="6" fill="#fbcfe8" />
      </svg>
      
      <div className="text-center">
        <p className="text-xs font-bold text-rose-700">{name}</p>
        <p className="text-[10px] text-rose-400">Уровень {level}</p>
      </div>
    </motion.div>
  );
};

export default Mascot;
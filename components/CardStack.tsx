import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { Card, SwipeDirection } from '../types';

interface CardStackProps {
  card: Card;
  onSwipe: (direction: SwipeDirection) => void;
}

const CardStack: React.FC<CardStackProps> = ({ card, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  
  const leftOpacity = useTransform(x, [0, 100], [0, 1]);
  const rightOpacity = useTransform(x, [-100, 0], [1, 0]);
  
  const boxColor = useTransform(x, [-150, 0, 150], ['rgba(239, 68, 68, 0.2)', 'rgba(0,0,0,0)', 'rgba(34, 197, 94, 0.2)']);

  const controls = useAnimation();
  const [dragStart, setDragStart] = useState(false);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      await controls.start({ x: 500, transition: { duration: 0.2 } });
      onSwipe(SwipeDirection.RIGHT);
    } else if (info.offset.x < -threshold) {
      await controls.start({ x: -500, transition: { duration: 0.2 } });
      onSwipe(SwipeDirection.LEFT);
    } else {
      controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
    setDragStart(false);
  };

  useEffect(() => {
    x.set(0);
    controls.set({ x: 0, rotate: 0 });
  }, [card.id, controls, x]);

  // Generic icon mapper based on Role keywords
  const getIcon = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('sultan') || r.includes('padişah') || r.includes('lider') || r.includes('başbakan') || r.includes('cumhurbaşkanı')) return '👑';
    if (r.includes('asker') || r.includes('general') || r.includes('paşa') || r.includes('yeniçeri') || r.includes('amiral')) return '⚔️';
    if (r.includes('rahip') || r.includes('hoca') || r.includes('şeyh') || r.includes('vaiz')) return '📿';
    if (r.includes('tüccar') || r.includes('mimar') || r.includes('hazine') || r.includes('bakan') || r.includes('imf')) return '💰';
    if (r.includes('casus') || r.includes('elçi') || r.includes('diplomat') || r.includes('düşman')) return '📜';
    if (r.includes('eş') || r.includes('sultan') || r.includes('valide')) return '💍';
    return '👤';
  };

  return (
    <div className="relative w-full max-w-md h-[55vh] flex items-center justify-center z-10 perspective-[1000px]">
      <motion.div 
        style={{ backgroundColor: boxColor }}
        className="absolute inset-0 rounded-2xl pointer-events-none transition-colors"
      />

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate, opacity }}
        animate={controls}
        onDragStart={() => setDragStart(true)}
        onDragEnd={handleDragEnd}
        className="w-full h-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col items-center justify-between p-0 cursor-grab active:cursor-grabbing relative overflow-hidden ring-1 ring-white/10"
      >
         {/* Background Image */}
         {card.image && (
            <div className="absolute inset-0 z-0">
               <img src={card.image} alt="Background" className="w-full h-full object-cover opacity-60" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
            </div>
         )}

         {/* Top Gradient Overlay for readability */}
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10"></div>

         <motion.div 
           style={{ opacity: rightOpacity }}
           className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-bold text-xl px-4 py-2 rounded-lg transform rotate-12 z-30 pointer-events-none bg-black/50 shadow-lg backdrop-blur"
         >
           {card.leftChoice}
         </motion.div>

         <motion.div 
           style={{ opacity: leftOpacity }}
           className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-bold text-xl px-4 py-2 rounded-lg transform -rotate-12 z-30 pointer-events-none bg-black/50 shadow-lg backdrop-blur"
         >
           {card.rightChoice}
         </motion.div>


        <div className="mt-8 flex flex-col items-center pointer-events-none relative z-20">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full mb-4 flex items-center justify-center text-4xl shadow-2xl ring-2 ring-slate-600/50 backdrop-blur-sm">
            {getIcon(card.role)}
          </div>
          <h2 className="text-2xl font-bold text-amber-400 mb-0 text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{card.character}</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-300 font-bold mt-1 drop-shadow-md">{card.role}</span>
        </div>

        <div className="flex-grow flex items-center justify-center pointer-events-none px-6 z-20 pb-12">
          <p className="text-xl text-center text-slate-50 leading-relaxed font-serif italic drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-shadow">
            "{card.text}"
          </p>
        </div>

        <div className="absolute bottom-6 w-full text-center text-slate-500 text-xs mt-4 mb-2 pointer-events-none z-20 h-6 px-4">
          {dragStart ? (
            <div className="flex justify-between w-full px-2 font-bold opacity-100 text-xs tracking-wider drop-shadow-lg">
               <span className="text-red-400 w-1/2 text-left pr-2 truncate border-l-2 border-red-500 pl-2 bg-black/40 rounded-r py-1">{card.leftChoice}</span>
               <span className="text-green-400 w-1/2 text-right pl-2 truncate border-r-2 border-green-500 pr-2 bg-black/40 rounded-l py-1">{card.rightChoice}</span>
            </div>
          ) : (
             <span className="animate-pulse tracking-[0.3em] uppercase text-[10px] text-slate-400 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">Karar Ver</span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CardStack;

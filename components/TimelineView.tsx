import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LEADERS } from '../constants';
import { Leader } from '../types';
import MapVisualizer from './MapVisualizer';
import { ArrowLeft, Lock, Play, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { soundManager } from '../utils/SoundManager';

interface TimelineViewProps {
  onBack: () => void;
  onPlayLeader: (leader: Leader) => void;
  maxYear: number;
}

const CARD_WIDTH = 320; // Width of a single card
const GAP = 40; // Gap between cards
const PADDING = 50; // Initial padding

const TimelineView: React.FC<TimelineViewProps> = ({ onBack, onPlayLeader, maxYear }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  
  // Motion values for smooth scrolling
  const x = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 300, damping: 30 });

  useEffect(() => {
    // Calculate total scrollable width
    const totalWidth = LEADERS.length * (CARD_WIDTH + GAP) + PADDING * 2 - window.innerWidth;
    setWidth(totalWidth > 0 ? totalWidth : 0);
  }, []);

  const handleDragEnd = () => {
    soundManager.playSwipe();
  };

  const scroll = (direction: number) => {
    const current = x.get();
    const target = current + (direction * (CARD_WIDTH + GAP));
    // Clamp values
    const clamped = Math.max(Math.min(target, 0), -width);
    x.set(clamped);
    soundManager.playSelect();
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 flex flex-col overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80"></div>
        <div className="w-full h-full opacity-10">
           <MapVisualizer mapState="growing" />
        </div>
      </div>

      {/* Header */}
      <div className="z-30 p-6 flex justify-between items-center bg-gradient-to-b from-slate-950 to-transparent">
        <button 
          onClick={() => { soundManager.playSelect(); onBack(); }}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <div className="p-2 rounded-full bg-slate-800 group-hover:bg-amber-600 transition-colors">
             <ArrowLeft size={20} />
          </div>
          <span className="uppercase tracking-widest text-sm font-bold">Menü</span>
        </button>
        <div className="text-right">
            <h2 className="text-amber-500 font-black uppercase tracking-[0.2em] text-xl">Tarih Çizelgesi</h2>
            <p className="text-xs text-slate-500 font-mono tracking-wider">1299 - 2025</p>
        </div>
      </div>

      {/* Main Draggable Area */}
      <div ref={containerRef} className="flex-grow relative flex items-center cursor-grab active:cursor-grabbing">
        
        {/* Central Timeline Axis Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800/50 -translate-y-1/2 z-0 pointer-events-none"></div>

        <motion.div 
          drag="x"
          dragConstraints={{ right: PADDING, left: -width - PADDING }}
          style={{ x: smoothX }}
          onDragEnd={handleDragEnd}
          className="flex items-center px-[50px] gap-[40px] z-10 h-full py-12"
        >
          {LEADERS.map((leader, index) => {
            const isUnlocked = leader.startYear <= (maxYear || 1299);
            const locked = !isUnlocked && index > 0;
            const isEraChange = index === 0 || LEADERS[index-1].era !== leader.era;
            
            return (
              <div key={leader.name} className="relative group shrink-0">
                
                {/* Era Marker (Above Card) */}
                {isEraChange && (
                  <div className="absolute -top-16 left-0 text-amber-500/80 text-[10px] uppercase tracking-[0.3em] font-bold border-l-2 border-amber-500 pl-3 py-1">
                    {leader.era}
                  </div>
                )}

                {/* Timeline Node on the Axis */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-600 -translate-x-1/2 -translate-y-1/2 z-0 group-hover:border-amber-500 group-hover:scale-125 transition-all duration-300">
                    {!locked && <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20"></div>}
                </div>

                {/* The Card */}
                <motion.div 
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-[320px] h-[55vh] rounded-xl border relative overflow-hidden flex flex-col transition-all duration-500
                    ${locked 
                      ? 'bg-slate-900/50 border-slate-800 grayscale backdrop-blur-sm' 
                      : 'bg-slate-800 border-slate-700 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]'
                    }
                  `}
                >
                  {/* Card Background Visual */}
                  <div className="absolute inset-0 opacity-30 pointer-events-none">
                     <MapVisualizer mapState={leader.mapState || 'small'} />
                  </div>
                  
                  {/* Content Container */}
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    
                    {/* Header: Date */}
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-6">
                      <Calendar size={12} />
                      <span>{leader.startYear} - {leader.endYear}</span>
                    </div>

                    {/* Leader Name */}
                    <div className="mb-4">
                      <h3 className={`text-2xl font-black uppercase leading-none mb-2 ${locked ? 'text-slate-600' : 'text-slate-100'}`}>
                        {leader.name}
                      </h3>
                      <span className={`text-xs uppercase tracking-[0.2em] font-bold ${locked ? 'text-slate-700' : 'text-amber-500'}`}>
                        {leader.title}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="w-12 h-1 bg-slate-700/50 mb-6"></div>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed font-serif italic ${locked ? 'text-slate-700' : 'text-slate-400'}`}>
                       {locked ? 'Bu dönemin kilidini açmak için önceki dönemleri tamamla.' : `"${leader.description}"`}
                    </p>

                    {/* Action Button (Bottom) */}
                    <div className="mt-auto">
                        {!locked ? (
                          <button 
                            onClick={() => { soundManager.playSelect(); onPlayLeader(leader); }}
                            className="w-full py-4 bg-slate-700/30 border border-slate-600 hover:bg-amber-600 hover:border-amber-500 hover:text-white text-slate-300 rounded transition-all uppercase tracking-widest text-[10px] font-bold flex items-center justify-center gap-2 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 duration-300"
                          >
                            <Play size={12} fill="currentColor" />
                            Oyuna Başla
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-slate-700">
                             <Lock size={16} />
                             <span className="text-[10px] uppercase tracking-widest font-bold">Kilitli</span>
                          </div>
                        )}
                    </div>
                  </div>
                </motion.div>

                {/* Connector Line to Axis */}
                <div className={`absolute left-1/2 -bottom-8 w-[1px] h-8 bg-gradient-to-b from-slate-700 to-transparent -translate-x-1/2 ${locked ? 'opacity-20' : 'opacity-50'}`}></div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-20">
         <button onClick={() => scroll(1)} className="p-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-full hover:bg-slate-700 active:scale-95 transition-all">
            <ChevronLeft size={24} />
         </button>
         <button onClick={() => scroll(-1)} className="p-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-full hover:bg-slate-700 active:scale-95 transition-all">
            <ChevronRight size={24} />
         </button>
      </div>

      {/* Decorative Year Markers along bottom */}
      <div className="absolute bottom-0 left-0 w-full h-12 border-t border-slate-900 bg-slate-950 flex items-center justify-between px-12 text-[10px] text-slate-700 font-mono select-none pointer-events-none z-10">
         <span>1299</span>
         <span>1453</span>
         <span>1923</span>
         <span>2025</span>
      </div>

    </div>
  );
};

export default TimelineView;

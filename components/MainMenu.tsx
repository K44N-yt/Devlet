import React from 'react';
import { motion } from 'framer-motion';
import { MapState } from '../types';
import MapVisualizer from './MapVisualizer';
import { Play, History, Info } from 'lucide-react';

interface MainMenuProps {
  onStart: () => void;
  onTimeline: () => void;
  maxYear: number;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onTimeline, maxYear }) => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <MapVisualizer mapState="peak" className="opacity-10 scale-150" />
      </div>

      <div className="z-10 flex flex-col items-center space-y-12">
        
        {/* Title Section */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-slate-900 drop-shadow-sm uppercase font-serif">
              DEVLET
            </h1>
            <h2 className="text-xl md:text-2xl font-light text-amber-500 tracking-[0.4em] uppercase -mt-2">
              Gölge Hükümdar
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-slate-500 text-xs md:text-sm tracking-[0.2em] uppercase font-mono mt-4"
          >
            1299 - 2025
          </motion.p>
        </div>

        {/* Menu Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col space-y-4 w-64"
        >
          <button 
            onClick={onStart}
            className="group relative px-6 py-4 bg-slate-900 border border-amber-600/40 rounded-sm text-amber-50 hover:bg-amber-900/20 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          >
            <div className="absolute inset-0 w-0 bg-amber-600/10 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
            <Play size={20} className="text-amber-500" />
            <span className="font-bold tracking-wider z-10">HÜKMET</span>
          </button>

          <button 
            onClick={onTimeline}
            className="group relative px-6 py-4 bg-slate-900 border border-slate-800 rounded-sm text-slate-400 hover:text-white hover:border-slate-600 transition-all duration-300 flex items-center justify-center gap-3"
          >
             <History size={20} />
             <span className="font-bold tracking-wider">TARİH</span>
          </button>

          <div className="text-center pt-4">
             <p className="text-[10px] text-slate-700 uppercase tracking-widest">
               En Yüksek Yıl: <span className="text-amber-600 font-bold">{maxYear}</span>
             </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 text-slate-700 text-[10px] tracking-widest opacity-50">
        v1.1 • Historical Simulation
      </div>
    </div>
  );
};

export default MainMenu;

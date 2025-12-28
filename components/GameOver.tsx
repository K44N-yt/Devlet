import React from 'react';
import { GameState } from '../types';
import { RefreshCw, History, Home } from 'lucide-react';

interface GameOverProps {
  gameState: GameState;
  onRestart: () => void;
  onMenu: () => void;
  onTimeline: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ gameState, onRestart, onMenu, onTimeline }) => {
  return (
    <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center p-8 animate-fade-in text-center backdrop-blur-sm">
      <h1 className="text-4xl font-bold text-red-600 mb-2 tracking-widest uppercase drop-shadow-md">SON</h1>
      <h2 className="text-2xl text-slate-100 mb-2 font-serif">{gameState.gameOverTitle}</h2>
      
      <div className="mb-6">
        <span className="text-amber-500 font-mono text-xl">{gameState.year}</span>
        <div className="text-xs text-slate-500 uppercase tracking-widest">{gameState.currentLeader.name} Dönemi</div>
      </div>

      <p className="text-slate-300 mb-8 max-w-sm leading-relaxed italic border-l-2 border-red-800 pl-4 bg-slate-800/50 py-4 pr-2">
        "{gameState.gameOverReason}"
      </p>

      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-sm mb-8 border border-slate-700 shadow-xl">
        <h3 className="text-slate-400 uppercase tracking-widest text-xs mb-4">Son Durum</h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm font-mono">
           <div className="flex justify-between items-center"><span className="text-blue-400">HALK</span> <span className="text-slate-200">{gameState.stats.people}</span></div>
           <div className="flex justify-between items-center"><span className="text-red-400">ORDU</span> <span className="text-slate-200">{gameState.stats.military}</span></div>
           <div className="flex justify-between items-center"><span className="text-amber-400">EKON</span> <span className="text-slate-200">{gameState.stats.economy}</span></div>
           <div className="flex justify-between items-center"><span className="text-purple-400">OTOR</span> <span className="text-slate-200">{gameState.stats.authority}</span></div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button 
          onClick={onRestart}
          className="flex items-center justify-center gap-2 bg-slate-100 text-slate-900 px-6 py-4 rounded-full font-bold hover:bg-amber-400 hover:scale-105 transition-all shadow-lg shadow-black/50"
        >
          <RefreshCw size={20} />
          TARİHİ YENİDEN YAZ
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onTimeline}
            className="flex items-center justify-center gap-2 bg-slate-800 text-slate-300 px-4 py-3 rounded-full font-bold hover:bg-slate-700 transition-all border border-slate-700 text-sm"
          >
            <History size={16} />
            ÇİZELGE
          </button>
          <button 
            onClick={onMenu}
            className="flex items-center justify-center gap-2 bg-slate-800 text-slate-300 px-4 py-3 rounded-full font-bold hover:bg-slate-700 transition-all border border-slate-700 text-sm"
          >
            <Home size={16} />
            MENÜ
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;

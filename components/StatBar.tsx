import React from 'react';
import { User, Shield, Coins, Crown } from 'lucide-react';
import { StatSet } from '../types';

interface StatBarProps {
  stats: StatSet;
}

const StatIcon: React.FC<{ type: keyof StatSet; value: number }> = ({ type, value }) => {
  let Icon = User;
  let color = 'text-slate-200';
  
  if (type === 'people') { Icon = User; color = 'text-blue-400'; }
  if (type === 'military') { Icon = Shield; color = 'text-red-400'; }
  if (type === 'economy') { Icon = Coins; color = 'text-amber-400'; }
  if (type === 'authority') { Icon = Crown; color = 'text-purple-400'; }

  // Visual warning if low or high
  const isDanger = value <= 20 || value >= 90;
  const dotColor = isDanger ? 'bg-red-500 animate-ping' : 'bg-slate-500';

  return (
    <div className="flex flex-col items-center w-1/4 relative">
      <div className={`mb-2 ${color} transition-all duration-300 transform ${isDanger ? 'scale-110' : ''}`}>
        <Icon size={24} strokeWidth={isDanger ? 3 : 2} />
      </div>
      <div className="w-2 h-2 rounded-full bg-slate-700 overflow-hidden relative">
          <div className={`absolute top-0 left-0 w-full h-full ${isDanger ? dotColor : ''} opacity-50`}></div>
      </div>
      <div className="h-24 w-4 bg-slate-800 rounded-full mt-2 relative overflow-hidden border border-slate-700">
         <div 
           className={`absolute bottom-0 left-0 w-full transition-all duration-500 ${isDanger ? 'bg-red-500' : 'bg-slate-400'}`}
           style={{ height: `${value}%` }}
         />
         <div className="absolute w-full border-t border-white opacity-20 top-[10%]" /> {/* 90 line */}
         <div className="absolute w-full border-t border-white opacity-20 bottom-[10%]" /> {/* 10 line */}
      </div>
    </div>
  );
};

const StatBar: React.FC<StatBarProps> = ({ stats }) => {
  return (
    <div className="w-full max-w-md px-4 py-4 flex justify-between items-end">
      <StatIcon type="people" value={stats.people} />
      <StatIcon type="military" value={stats.military} />
      <StatIcon type="economy" value={stats.economy} />
      <StatIcon type="authority" value={stats.authority} />
    </div>
  );
};

export default StatBar;

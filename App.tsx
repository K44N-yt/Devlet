import React, { useState, useEffect, useCallback } from 'react';
import { CARDS, INITIAL_STATE, LEADERS } from './constants';
import { GameState, SwipeDirection, Leader, Era, AppView, SaveData } from './types';
import CardStack from './components/CardStack';
import StatBar from './components/StatBar';
import GameOver from './components/GameOver';
import MainMenu from './components/MainMenu';
import TimelineView from './components/TimelineView';
import MapVisualizer from './components/MapVisualizer';
import { soundManager } from './utils/SoundManager';

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const SAVE_KEY = 'shadow_reign_save';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('MENU');
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [saveData, setSaveData] = useState<SaveData>({ maxYear: 1299, unlockedEras: [Era.FOUNDATION], runs: 0 });
  const [mounted, setMounted] = useState(false);

  // Load Save Data
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        setSaveData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse save data", e);
      }
    }
  }, []);

  // Save Data Helper
  const persistData = (newData: Partial<SaveData>) => {
    setSaveData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getLeaderForYear = (year: number): Leader => {
    const leader = LEADERS.find(l => year >= l.startYear && year <= l.endYear);
    if (!leader) {
      if (year < 1299) return LEADERS[0];
      return LEADERS[LEADERS.length - 1];
    }
    return leader;
  };

  const getRandomCard = (currentState: GameState) => {
    const { year, turnCount } = currentState;
    
    // 1. Delayed Effects
    const pending = currentState.delayedQueue.find(d => d.turnDue <= turnCount);
    if (pending) {
       const forcedCard = CARDS.find(c => c.id === pending.cardId);
       if (forcedCard) return forcedCard;
    }

    // 2. Filter by Year and Stats
    const available = CARDS.filter(c => {
       if (currentState.history.includes(c.id)) return false;
       if (c.minYear && year < c.minYear) return false;
       if (c.maxYear && year > c.maxYear) return false;
       if (currentState.currentCard && c.id === currentState.currentCard.id) return false;
       
       if (c.conditions) {
         const { people, military, economy, authority } = currentState.stats;
         const { minPeople, maxPeople, minMilitary, maxMilitary, minEconomy, maxEconomy, minAuthority, maxAuthority } = c.conditions;
         if (minPeople !== undefined && people < minPeople) return false;
         if (maxPeople !== undefined && people > maxPeople) return false;
         if (minMilitary !== undefined && military < minMilitary) return false;
         if (maxMilitary !== undefined && military > maxMilitary) return false;
         if (minEconomy !== undefined && economy < minEconomy) return false;
         if (maxEconomy !== undefined && economy > maxEconomy) return false;
         if (minAuthority !== undefined && authority < minAuthority) return false;
         if (maxAuthority !== undefined && authority > maxAuthority) return false;
       }
       return true;
    });

    if (available.length === 0) {
      const currentLeaderEra = getLeaderForYear(year).era;
      const eraCards = CARDS.filter(c => {
         const cardLeader = LEADERS.find(l => (c.minYear || 0) >= l.startYear && (c.minYear || 0) <= l.endYear);
         return cardLeader?.era === currentLeaderEra;
      });
      if (eraCards.length > 0) return eraCards[Math.floor(Math.random() * eraCards.length)];
      return CARDS[0];
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  };

  const pickNextCard = (state: GameState) => {
    const nextCard = getRandomCard(state);
    setGameState(prev => ({ ...prev, currentCard: nextCard }));
  };

  const checkGameOver = (stats: any, hiddenStats: any, year: number, leader: Leader): { isOver: boolean, title: string, reason: string } => {
    if (hiddenStats.coupRisk > 100) return { isOver: true, title: "Askeri Darbe", reason: `${leader.name} döneminde ordu yönetime el koydu. Siyaset yasaklandı.` };
    if (hiddenStats.rebellionRisk > 100) return { isOver: true, title: "İç Savaş", reason: "Ülke kardeş kavgasına sürüklendi. Devlet otoritesi çöktü." };
    if (hiddenStats.corruption > 100) return { isOver: true, title: "Devlet Çöktü", reason: "Rüşvet ve iltimas devleti kemirdi. Hazine tamtakır." };
    if (hiddenStats.spyInfluence > 100) return { isOver: true, title: "Mandacılık", reason: "Ülke artık başkentten değil, yabancı elçiliklerden yönetiliyor." };

    if (stats.people <= 0) return { isOver: true, title: "Halk Ayaklanması", reason: "Aç ve öfkeli kalabalıklar sarayı bastı." };
    if (stats.people >= 100) return { isOver: true, title: "Cumhuriyet?", reason: "Halkın gücü kontrolsüz bir kaosa dönüştü." }; 

    if (stats.military <= 0) return { isOver: true, title: "İşgal", reason: "Ordusuz vatan savunulamaz. Sınırlar kevgire döndü." };
    if (stats.military >= 100) {
       if (year < 1923) return { isOver: true, title: "Yeniçeri Diktası", reason: "Kazan kaldırdılar. Padişah artık bir kukla." };
       return { isOver: true, title: "Cunta Rejimi", reason: "Generaller kışladan çıkıp yönetime el koydu." };
    }
    
    if (stats.economy <= 0) return { isOver: true, title: "İflas (Moratoryum)", reason: "Düyun-u Umumiye veya IMF kapıda. Maaşlar ödenemiyor." };
    if (stats.economy >= 100) return { isOver: true, title: "Oligarşi", reason: "Para her şeyi satın aldı. Ruhunu bile." };
    
    if (stats.authority <= 0) return { isOver: true, title: "Otorite Boşluğu", reason: "Kimse emirlerini dinlemiyor. Devlet aciz kaldı." };
    if (stats.authority >= 100) return { isOver: true, title: "İstibdat", reason: "Baskı rejimi sürdürülemez hale geldi. Özgürlük isteyenler seni devirdi." };

    if (year >= 2025) return { isOver: true, title: "Tarih Yazıldı", reason: "2025 yılına ulaştın. Türkiye'nin geleceği artık senin mirasın üzerine kurulu." };

    return { isOver: false, title: "", reason: "" };
  };

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    if (!gameState.currentCard || gameState.gameOver) return;

    soundManager.playSwipe(); // Play Sound

    const card = gameState.currentCard;
    const effects = direction === SwipeDirection.LEFT ? card.leftEffects : card.rightEffects;

    setGameState(prev => {
      const newStats = {
        people: clamp(prev.stats.people + (effects.people || 0), 0, 100),
        military: clamp(prev.stats.military + (effects.military || 0), 0, 100),
        economy: clamp(prev.stats.economy + (effects.economy || 0), 0, 100),
        authority: clamp(prev.stats.authority + (effects.authority || 0), 0, 100),
      };

      const newHiddenStats = {
        coupRisk: Math.max(0, prev.hiddenStats.coupRisk + (effects.coupRisk || 0)),
        rebellionRisk: Math.max(0, prev.hiddenStats.rebellionRisk + (effects.rebellionRisk || 0)),
        corruption: Math.max(0, prev.hiddenStats.corruption + (effects.corruption || 0)),
        spyInfluence: Math.max(0, prev.hiddenStats.spyInfluence + (effects.spyInfluence || 0)),
      };

      let timeJump = card.yearJump || 0;
      if (!timeJump) {
         if (prev.year < 1600) timeJump = 5;
         else if (prev.year < 1800) timeJump = 3;
         else if (prev.year < 1923) timeJump = 2;
         else timeJump = 1;
      }
      const newYear = prev.year + timeJump;
      const newLeader = getLeaderForYear(newYear);

      const gameOverCheck = checkGameOver(newStats, newHiddenStats, newYear, newLeader);
      
      if (gameOverCheck.isOver) {
        soundManager.playGameOver(); // Play Game Over Sound
        persistData({
          maxYear: Math.max(saveData.maxYear, newYear),
          runs: saveData.runs + 1
        });

        return {
          ...prev,
          stats: newStats,
          hiddenStats: newHiddenStats,
          year: newYear,
          currentLeader: newLeader,
          gameOver: true,
          gameOverTitle: gameOverCheck.title,
          gameOverReason: gameOverCheck.reason
        };
      }

      const newHistory = [...prev.history, card.id];
      const nextTurn = prev.turnCount + 1;
      const intermediateState = {
        ...prev,
        stats: newStats,
        hiddenStats: newHiddenStats,
        year: newYear,
        currentLeader: newLeader,
        turnCount: nextTurn,
        delayedQueue: prev.delayedQueue.filter(d => d.turnDue > nextTurn),
        history: newHistory
      };

      const nextCard = getRandomCard(intermediateState);

      return {
        ...intermediateState,
        currentCard: nextCard,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentCard, gameState.gameOver, saveData]); 

  const startGame = (startLeader?: Leader) => {
    soundManager.init(); // Initialize Audio Context
    soundManager.playSelect();

    let newState = INITIAL_STATE;
    if (startLeader) {
       newState = {
         ...INITIAL_STATE,
         year: startLeader.startYear,
         currentLeader: startLeader
       };
    }
    setGameState(newState);
    pickNextCard(newState);
    setView('GAME');
  };

  const goMenu = () => {
    soundManager.playSelect();
    setView('MENU');
  }

  const goTimeline = () => {
    soundManager.playSelect();
    setView('TIMELINE');
  }

  if (!mounted) return null;

  // --- VIEW ROUTING ---
  
  if (view === 'MENU') {
    return (
      <MainMenu 
        onStart={() => startGame()} 
        onTimeline={() => goTimeline()} 
        maxYear={saveData.maxYear}
      />
    );
  }

  if (view === 'TIMELINE') {
    return (
      <TimelineView 
        onBack={() => goMenu()}
        onPlayLeader={startGame}
        maxYear={saveData.maxYear}
      />
    );
  }

  // GAME VIEW
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-between py-4 relative overflow-hidden">
      
      {/* Dynamic Background Visualizer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <MapVisualizer 
          mapState={gameState.currentLeader.mapState || 'small'} 
          className="opacity-30 scale-125 transition-all duration-[2000ms]" 
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-900/50 to-slate-950"></div>
      </div>

      {/* Header with Era and Year */}
      <div className="z-10 text-center mt-4">
        <h1 className="text-xl font-bold tracking-[0.2em] text-amber-500 uppercase drop-shadow-lg">{gameState.currentLeader.title} {gameState.currentLeader.name}</h1>
        <div className="flex items-center justify-center gap-3 text-slate-400 mt-1 text-sm font-mono">
           <span>{gameState.currentLeader.era}</span>
           <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
           <span className="text-slate-200 text-lg font-bold">{gameState.year}</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-grow flex items-center justify-center w-full z-10 px-4 mt-[-20px]">
        {gameState.currentCard && !gameState.gameOver && (
          <CardStack 
            card={gameState.currentCard} 
            onSwipe={handleSwipe} 
          />
        )}
      </div>

      {/* Stats Footer */}
      <div className="z-10 w-full flex justify-center pb-safe">
         <StatBar stats={gameState.stats} />
      </div>

      {/* Game Over Overlay */}
      {gameState.gameOver && (
        <GameOver 
          gameState={gameState} 
          onRestart={() => startGame()} 
          onMenu={() => goMenu()}
          onTimeline={() => goTimeline()}
        />
      )}
    </div>
  );
};

export default App;

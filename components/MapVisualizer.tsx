import React from 'react';
import { motion } from 'framer-motion';
import { MapState } from '../types';

interface MapVisualizerProps {
  mapState: MapState;
  className?: string;
}

// Abstract path data for different states
// These are not geographically perfect but represent the "feeling" of expansion/contraction
const PATHS = {
  small: "M 45 45 Q 50 40 55 45 Q 60 50 55 55 Q 50 60 45 55 Q 40 50 45 45 Z", // Small blob (Anatolia/Sogut)
  growing: "M 40 45 Q 50 30 60 40 Q 75 45 70 60 Q 55 70 45 65 Q 30 55 40 45 Z", // Expanding into Balkans
  peak: "M 30 40 Q 50 10 70 30 Q 90 40 85 60 Q 70 85 50 80 Q 20 70 30 40 Z", // Massive empire
  stagnant: "M 30 40 Q 50 15 70 30 Q 85 45 80 60 Q 65 80 50 75 Q 25 65 30 40 Z", // Slightly rigid/bloated
  shrinking: "M 35 45 Q 50 35 65 40 Q 70 55 60 65 Q 50 70 40 60 Q 30 55 35 45 Z", // Losing Balkans/Middle East
  republic: "M 38 48 L 45 42 L 55 42 L 62 48 L 60 55 L 48 58 L 38 52 Z" // Compact polygon (Modern Turkey approximation)
};

const COLORS = {
  small: "#f59e0b", // Amber
  growing: "#22c55e", // Green
  peak: "#ef4444", // Red (Power)
  stagnant: "#a855f7", // Purple
  shrinking: "#64748b", // Slate
  republic: "#ef4444", // Red (Flag)
};

const MapVisualizer: React.FC<MapVisualizerProps> = ({ mapState, className }) => {
  return (
    <div className={`w-full h-full flex items-center justify-center opacity-20 pointer-events-none ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated Abstract Shape */}
        <motion.path
          d={PATHS[mapState]}
          fill={COLORS[mapState]}
          initial={false}
          animate={{ 
            d: PATHS[mapState],
            fill: COLORS[mapState]
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 40
          }}
          filter="url(#glow)"
        />
        
        {/* Pulse Effect */}
        <motion.path
          d={PATHS[mapState]}
          fill="transparent"
          stroke={COLORS[mapState]}
          strokeWidth="0.5"
          initial={false}
          animate={{ 
            d: PATHS[mapState],
            scale: [1, 1.1, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "center" }}
        />
      </svg>
    </div>
  );
};

export default MapVisualizer;


import React from 'react';

const GameStats: React.FC = () => {
  return (
    <div className="grid grid-cols-3 bg-game-orange rounded-lg mb-4">
      <div className="p-3 text-center">
        <div className="text-white text-sm">Number of players</div>
        <div className="text-white font-bold flex items-center justify-center">
          <span className="mr-1">👤</span>
          7704
        </div>
      </div>
      
      <div className="p-3 text-center border-l border-r border-orange-600">
        <div className="text-white text-sm">Total bets</div>
        <div className="text-white font-bold flex items-center justify-center">
          <span className="mr-1">👍</span>
          403876.32 BDT
        </div>
      </div>
      
      <div className="p-3 text-center">
        <div className="text-white text-sm">Total winnings</div>
        <div className="text-white font-bold flex items-center justify-center">
          <span className="mr-1">👑</span>
          992373.12 BDT
        </div>
      </div>
    </div>
  );
};

export default GameStats;

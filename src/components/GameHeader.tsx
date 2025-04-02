
import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

interface GameHeaderProps {
  balance: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ balance }) => {
  return (
    <div className="bg-game-accent py-4 px-6 flex items-center justify-between mb-4">
      <div className="flex items-center">
        <button className="text-white mr-4">
          <ArrowLeft size={24} />
        </button>
        <div className="bg-game-background rounded-full py-2 px-4 flex items-center">
          <span className="text-white font-bold">{balance.toFixed(2)} ₿</span>
          <button className="bg-game-orange ml-3 rounded-full w-6 h-6 flex items-center justify-center">
            <Plus size={16} className="text-white" />
          </button>
        </div>
      </div>
      <div className="bg-transparent border border-white/30 rounded-full p-1">
        <div className="text-white text-xs font-bold px-2">BONUS</div>
      </div>
    </div>
  );
};

export default GameHeader;


import React from 'react';
import { History } from 'lucide-react';

interface GameTabsProps {
  activeTab: 'tc' | 'history';
  setActiveTab: (tab: 'tc' | 'history') => void;
}

const GameTabs: React.FC<GameTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex mb-2">
      <button
        className={`flex-1 py-3 rounded-t-lg font-bold ${
          activeTab === 'tc' 
            ? 'bg-game-orange text-white' 
            : 'bg-game-panel text-white/70'
        }`}
        onClick={() => setActiveTab('tc')}
      >
        T&C
      </button>
      
      <button
        className={`flex-1 py-3 rounded-t-lg font-bold flex items-center justify-center ${
          activeTab === 'history' 
            ? 'bg-game-orange text-white' 
            : 'bg-game-panel text-white/70'
        }`}
        onClick={() => setActiveTab('history')}
      >
        <History size={18} className="mr-2" />
        HISTORY
      </button>
    </div>
  );
};

export default GameTabs;

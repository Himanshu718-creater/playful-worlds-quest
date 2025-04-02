
import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Input } from './ui/input';

interface BetPanelProps {
  betAmount: string;
  setBetAmount: (value: string) => void;
  placeBet: (amount: number) => void;
  cashOut: () => void;
  gameState: 'waiting' | 'running' | 'crashed';
  hasPlacedBet: boolean;
  hasCashedOut: boolean;
  currentMultiplier: number;
}

const BetPanel: React.FC<BetPanelProps> = ({
  betAmount,
  setBetAmount,
  placeBet,
  cashOut,
  gameState,
  hasPlacedBet,
  hasCashedOut,
  currentMultiplier
}) => {
  const presetAmounts = [20, 100, 200, 700, 2000, 10000];
  const [customAmount, setCustomAmount] = useState('');
  
  const handleBetSubmit = () => {
    const amount = parseFloat(betAmount);
    if (!isNaN(amount) && amount > 0) {
      placeBet(amount);
    }
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(value);
  };
  
  const applyCustomAmount = () => {
    if (customAmount && !isNaN(parseFloat(customAmount))) {
      setBetAmount(customAmount);
    }
    setCustomAmount('');
  };
  
  const handleClearBet = () => {
    setBetAmount("");
  };
  
  const canPlaceBet = gameState === 'waiting' && !hasPlacedBet;
  const canCashOut = gameState === 'running' && hasPlacedBet && !hasCashedOut;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <div className="font-bold text-white text-lg">STAKE SELECTOR</div>
        <button className="bg-game-accent text-white px-4 py-1 rounded">AUTOBET</button>
      </div>
      
      <div className="mb-2">
        <label className="block text-white mb-1">Bet</label>
        <div className="relative">
          <input
            type="text"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            disabled={!canPlaceBet}
            className="w-full bg-white rounded-lg p-3 text-black text-lg"
            placeholder="Enter amount"
          />
          {betAmount && (
            <button
              onClick={handleClearBet}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => setBetAmount(amount.toString())}
            disabled={!canPlaceBet}
            className="bg-game-accent text-white py-2 rounded-lg hover:bg-game-panel disabled:opacity-50"
          >
            {amount}
          </button>
        ))}
      </div>
      
      {/* Manual bet input section */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              disabled={!canPlaceBet}
              className="bg-game-panel text-white pl-9 py-2"
              placeholder="Custom amount"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-game-orange">
              <DollarSign size={16} />
            </div>
          </div>
          <button
            onClick={applyCustomAmount}
            disabled={!canPlaceBet || !customAmount}
            className="bg-game-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleBetSubmit}
          disabled={!canPlaceBet}
          className="bg-game-orange text-white py-4 rounded-lg font-bold disabled:opacity-50"
        >
          PLACE A BET
          <div className="text-xs">
            (next round)
          </div>
        </button>
        
        <button
          onClick={cashOut}
          disabled={!canCashOut}
          className={`bg-game-red text-white py-4 rounded-lg font-bold disabled:opacity-50 
            ${canCashOut ? 'animate-pulse' : ''}`}
        >
          TAKE WINNINGS
          {canCashOut && (
            <div className="text-xs">
              {((parseFloat(betAmount) || 0) * currentMultiplier).toFixed(2)} BDT
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default BetPanel;

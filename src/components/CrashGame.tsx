
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, History, Plus, X } from 'lucide-react';
import GameHeader from './GameHeader';
import CrashGraph from './CrashGraph';
import BetPanel from './BetPanel';
import GameStats from './GameStats';
import PlayersTable from './PlayersTable';
import GameTabs from './GameTabs';

const CrashGame: React.FC = () => {
  const [balance, setBalance] = useState(232895.32);
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [gameState, setGameState] = useState<'waiting' | 'running' | 'crashed'>('waiting');
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(0);
  const [gameHistory, setGameHistory] = useState<number[]>([2.31, 1.74, 3.36, 2.96, 2.54, 2.57, 1.57, 4.00, 4.93]);
  const [activeTab, setActiveTab] = useState<'tc' | 'history'>('tc');
  const [players, setPlayers] = useState([
    { username: "******31", odds: 1.74, bet: 1667.71, win: 2901.79 },
    { username: "******79", odds: 3.36, bet: 1123.73, win: 3775.7 },
    { username: "******47", odds: 2.96, bet: 615.04, win: 1820.5 },
    { username: "******31", odds: 2.54, bet: 360.03, win: 914.45 },
    { username: "******03", odds: 2.57, bet: 345.68, win: 888.38 },
    { username: "******47", odds: 1.57, bet: 334.94, win: 525.85 },
    { username: "******79", odds: 4.00, bet: 298.95, win: 1195.78 },
    { username: "******67", odds: 4.93, bet: 267.85, win: 1320.46 }
  ]);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Generate a random crash point between 1 and 10
  const generateCrashPoint = () => {
    // Create a skewed distribution favoring lower numbers
    // This is a simplified simulation of real crash game algorithms
    const random = Math.random();
    const skewed = Math.pow(random, 0.8); // Adjust power for different distributions
    
    // Min 1.01, max around 10, but can go higher rarely
    return 1.01 + (skewed * 9);
  };

  const startGame = () => {
    if (gameState !== 'waiting') return;
    
    setGameState('running');
    setMultiplier(1.0);
    setCrashPoint(generateCrashPoint());
    startTimeRef.current = Date.now();
    setHasCashedOut(false);
    animateGame();
  };

  const animateGame = () => {
    if (!startTimeRef.current) return;
    
    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    
    // Calculate new multiplier value - exponential growth for realistic look
    const newMultiplier = Math.pow(1.0015, elapsed * 1000);
    setMultiplier(parseFloat(newMultiplier.toFixed(2)));
    
    if (newMultiplier >= crashPoint) {
      endGame();
      return;
    }
    
    animationRef.current = requestAnimationFrame(animateGame);
  };

  const endGame = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setGameState('crashed');
    
    // Add this game to history
    setGameHistory(prev => [parseFloat(multiplier.toFixed(2)), ...prev].slice(0, 10));
    
    // Start a new game after 3 seconds
    setTimeout(() => {
      setGameState('waiting');
      if (hasPlacedBet && !hasCashedOut) {
        setCurrentBet(null);
        setHasPlacedBet(false);
      }
    }, 3000);
  };

  const placeBet = (amount: number) => {
    if (gameState !== 'waiting' || hasPlacedBet) return;
    if (amount <= 0 || amount > balance) return;
    
    setCurrentBet(amount);
    setBalance(prev => prev - amount);
    setHasPlacedBet(true);
  };

  const cashOut = () => {
    if (!hasPlacedBet || hasCashedOut || gameState !== 'running' || !currentBet) return;
    
    const winnings = currentBet * multiplier;
    setBalance(prev => prev + winnings);
    setWinAmount(winnings);
    setHasCashedOut(true);
    
    // Add to players list with random username
    const randomNum = Math.floor(Math.random() * 100);
    const newPlayer = {
      username: `******${randomNum}`,
      odds: multiplier,
      bet: currentBet,
      win: parseFloat(winnings.toFixed(2))
    };
    setPlayers(prev => [newPlayer, ...prev.slice(0, 7)]);
  };

  useEffect(() => {
    if (gameState === 'waiting' && !hasPlacedBet) {
      const timer = setTimeout(() => startGame(), 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState, hasPlacedBet]);

  return (
    <div className="flex flex-col min-h-screen bg-game-background">
      <GameHeader balance={balance} />
      
      <div className="container mx-auto px-4 pb-8 flex-1">
        <GameTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <CrashGraph 
          gameState={gameState} 
          multiplier={multiplier} 
        />
        
        <BetPanel 
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          placeBet={placeBet}
          cashOut={cashOut}
          gameState={gameState}
          hasPlacedBet={hasPlacedBet}
          hasCashedOut={hasCashedOut}
          currentMultiplier={multiplier}
        />
        
        <GameStats />
        
        <PlayersTable players={players} />
      </div>
    </div>
  );
};

export default CrashGame;

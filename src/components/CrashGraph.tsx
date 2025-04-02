import React, { useRef, useEffect } from 'react';

interface CrashGraphProps {
  gameState: 'waiting' | 'running' | 'crashed';
  multiplier: number;
}

const CrashGraph: React.FC<CrashGraphProps> = ({ gameState, multiplier }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const container = containerRef.current;
    
    // Set canvas dimensions to match its container
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    context.beginPath();
    context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    context.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x < canvas.width; x += 50) {
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
    }
    
    // Horizontal grid lines
    for (let y = 0; y < canvas.height; y += 50) {
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
    }
    
    context.stroke();
    
    // Calculate points for graph
    if (gameState === 'running' || gameState === 'crashed') {
      // Calculate graph points based on multiplier
      // Map multiplier to y position (inverted for canvas)
      const maxY = canvas.height - 20; // Bottom margin
      const minY = 20; // Top margin
      
      // Start at the bottom left
      const startX = 20;
      const startY = maxY;
      
      // Calculate curve based on multiplier
      const xProgress = Math.min(multiplier / 10, 1) * (canvas.width - 40); // Scale multiplier to canvas width
      const yPosition = maxY - (Math.log(multiplier) * 50); // Logarithmic curve
      
      // Add point to history
      if (gameState === 'running') {
        pointsRef.current.push({ x: startX + xProgress, y: yPosition });
        // Keep only recent points for performance
        if (pointsRef.current.length > 100) {
          pointsRef.current = pointsRef.current.slice(-100);
        }
      }
      
      // Draw the line
      context.beginPath();
      context.moveTo(startX, startY);
      
      // Draw curve using points
      if (pointsRef.current.length > 0) {
        for (let i = 0; i < pointsRef.current.length; i++) {
          context.lineTo(pointsRef.current[i].x, pointsRef.current[i].y);
        }
      } else {
        context.lineTo(startX + xProgress, yPosition);
      }
      
      // Style for the line
      context.strokeStyle = '#ffc145'; // Gold/yellow
      context.lineWidth = 3;
      context.stroke();
      
      // Draw rocket at the end of the line
      if (pointsRef.current.length > 0) {
        const lastPoint = pointsRef.current[pointsRef.current.length - 1];
        
        // Draw circle at the end
        context.beginPath();
        context.arc(lastPoint.x, lastPoint.y, 6, 0, Math.PI * 2);
        context.fillStyle = '#ffc145';
        context.fill();
      }
    }
    
    // Reset points when waiting for new game
    if (gameState === 'waiting') {
      pointsRef.current = [];
    }
    
    // If crashed, highlight in red
    if (gameState === 'crashed') {
      context.fillStyle = 'rgba(217, 48, 79, 0.3)'; // Semi-transparent red
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // "CRASHED" text
      context.font = 'bold 32px Arial';
      context.fillStyle = '#d9304f';
      context.textAlign = 'center';
      context.fillText('CRASHED', canvas.width / 2, canvas.height / 2);
    }
    
  }, [gameState, multiplier]);
  
  return (
    <div className="crash-graph-container mb-4 border border-game-accent rounded-lg" ref={containerRef}>
      <canvas ref={canvasRef} className="crash-graph" />
      <div className="multiplier-text">
        {gameState === 'waiting' ? (
          <span>STARTING...</span>
        ) : (
          <span>{multiplier.toFixed(2)}x</span>
        )}
      </div>
    </div>
  );
};

export default CrashGraph;

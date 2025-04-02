
import React from 'react';

interface Player {
  username: string;
  odds: number;
  bet: number;
  win: number;
}

interface PlayersTableProps {
  players: Player[];
}

const PlayersTable: React.FC<PlayersTableProps> = ({ players }) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <table className="w-full">
        <thead className="bg-game-accent">
          <tr>
            <th className="text-white text-left p-3">USERNAME</th>
            <th className="text-white text-left p-3">ODDS</th>
            <th className="text-white text-left p-3">BET</th>
            <th className="text-white text-left p-3">WIN</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index} className="border-b border-game-accent">
              <td className="p-3 text-white/80">{player.username}</td>
              <td className="p-3 text-white/80">x{player.odds.toFixed(2)}</td>
              <td className="p-3 text-white/80">{player.bet.toFixed(2)} BDT</td>
              <td className="p-3 text-game-win">{player.win.toFixed(2)} BDT</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayersTable;

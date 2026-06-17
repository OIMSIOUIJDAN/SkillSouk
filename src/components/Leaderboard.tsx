import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUser?: LeaderboardEntry;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  const topThree = entries.slice(0, 3);

  const rankStyles: { [key: number]: string } = {
    1: 'from-yellow-500 to-yellow-300 border-yellow-400',
    2: 'from-gray-400 to-gray-300 border-gray-400',
    3: 'from-amber-700 to-amber-500 border-amber-600',
  };

  const rankEmojis = ['🥇', '🥈', '🥉'];

  return (
    <div className="glass rounded-2xl p-4 md:p-6 gold-border">
      <h3 className="font-display font-bold text-xl text-gold mb-4 flex items-center gap-2">
        <span>🏆</span> Top Merchants
      </h3>

      <div className="space-y-3">
        {topThree.map((entry, index) => (
          <div
            key={entry.id}
            className="glass-dark rounded-xl p-3 flex items-center gap-3 transition-all hover:scale-[1.02] border border-white/10"
          >
            {/* Rank */}
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankStyles[index + 1] || 'from-gray-500 to-gray-400'} flex items-center justify-center font-bold text-night flex-shrink-0`}>
              {index + 1}
            </div>

            {/* Avatar */}
            <div className="text-2xl flex-shrink-0">{entry.avatar}</div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-cream text-sm truncate">{entry.name}</span>
                {entry.role === 'merchant' && (
                  <span className="text-xs bg-terracotta/20 text-terracotta px-2 py-0.5 rounded-full">Merchant</span>
                )}
              </div>
              <div className="text-cream/50 text-xs">Level {entry.level}</div>
            </div>

            {/* Stats */}
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 justify-end">
                <span className="text-sm">🪙</span>
                <span className="text-gold font-bold text-sm">{entry.coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <span className="text-xs">{entry.streak > 0 ? '🔥' : '❄️'}</span>
                <span className="text-cream/50 text-xs">{entry.streak}</span>
              </div>
            </div>

            {/* Medal */}
            <div className="text-2xl flex-shrink-0">{rankEmojis[index]}</div>
          </div>
        ))}
      </div>

      {/* View Full Button */}
      <button className="w-full mt-4 py-2 text-center text-turquoise text-sm hover:text-gold transition-colors">
        View Full Leaderboard →
      </button>
    </div>
  );
};

export default Leaderboard;

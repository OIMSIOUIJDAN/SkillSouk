import React, { useState, useEffect } from 'react';
import { UserState, District, FocusZone, DailyQuest } from '../types';
import { districts, focusZones } from '../data/districts';
import { quests } from '../data/quests';
import { leaderboard } from '../data/leaderboard';
import GameHUD from './GameHUD';
import DistrictCard from './DistrictCard';
import QuestCard from './QuestCard';
import FocusZoneCard from './FocusZoneCard';
import Leaderboard from './Leaderboard';

interface DashboardScreenProps {
  user: UserState;
  onDistrictClick: (district: District) => void;
  onFocusZoneClick: (zone: FocusZone) => void;
  onRoleChange: () => void;
  dailyQuest: DailyQuest;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  onDistrictClick,
  onFocusZoneClick,
  onRoleChange,
  dailyQuest,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Zellige photo dashboard banner */}
      <div className="relative w-full h-28 md:h-36 overflow-hidden mb-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/zellige-bg.jpg')", backgroundPositionY: '30%' }}
        />
        {/* Gradient overlay — lighter in centre so texture shows */}
        <div className="absolute inset-0 bg-gradient-to-b from-night/30 via-night/55 to-night" />
        {/* Subtle side-to-side shimmer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(242,204,143,0.06)_0%,transparent_100%)]" />
        {/* Welcome text */}
        <div className="absolute inset-0 flex items-center justify-center pb-4">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-gold gold-glow tracking-wide drop-shadow-2xl">
            🏺 Welcome Back to the Souk
          </h1>
        </div>
      </div>

      <div className="p-4 md:p-6">
      {/* Game HUD */}
      <div className="mb-6">
        <GameHUD user={user} />
      </div>

      {/* Daily Quest Quick View */}
      <div className="glass rounded-xl p-3 mb-6 border border-gold/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-pulse">{dailyQuest.emoji}</span>
          <div>
            <div className="font-bold text-gold text-sm">Daily Quest</div>
            <div className="text-cream/70 text-xs">{dailyQuest.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-20 md:w-32 bg-night-lighter rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-500"
              style={{ width: `${(dailyQuest.progress / dailyQuest.target) * 100}%` }}
            />
          </div>
          <span className="text-cream/50 text-xs">{dailyQuest.progress}/{dailyQuest.target}</span>
          <div className="flex items-center gap-1 text-xs">
            <span>🪙</span>
            <span className="text-gold">+{dailyQuest.reward}</span>
          </div>
        </div>
      </div>

      {/* Role Badge & Switch */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="glass px-4 py-2 rounded-full text-sm border border-white/10">
            {user.role === 'merchant' ? (
              <>
                <span className="text-terracotta">💰</span>
                <span className="text-terracotta font-semibold ml-1">Merchant Mode</span>
              </>
            ) : (
              <>
                <span className="text-turquoise">📚</span>
                <span className="text-turquoise font-semibold ml-1">Seeker Mode</span>
              </>
            )}
          </span>
        </div>
        <button
          onClick={onRoleChange}
          className="text-cream/60 hover:text-gold text-sm flex items-center gap-1 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">🔄</span>
          <span>Switch Role</span>
        </button>
      </div>

      {/* Achievement Badges */}
      {user.achievements.length > 0 && (
        <div className="glass rounded-xl p-3 mb-6 flex items-center gap-4 overflow-x-auto border border-white/10">
          <span className="text-cream/50 text-sm whitespace-nowrap">Achievements:</span>
          <div className="flex items-center gap-2">
            {user.achievements.map((badge, i) => (
              <span key={i} className="text-2xl transform hover:scale-125 transition-transform cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }} title={badge}>
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass rounded-xl p-3 text-center border border-turquoise/30 hover:border-turquoise transition-colors">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-2xl font-bold text-turquoise">{user.downloadsCount}</div>
          <div className="text-cream/50 text-xs">Downloads</div>
        </div>
        <div className="glass rounded-xl p-3 text-center border border-terracotta/30 hover:border-terracotta transition-colors">
          <div className="text-2xl mb-1">📤</div>
          <div className="text-2xl font-bold text-terracotta">{user.uploadsCount}</div>
          <div className="text-cream/50 text-xs">Uploads</div>
        </div>
        <div className="glass rounded-xl p-3 text-center border border-gold/30 hover:border-gold transition-colors">
          <div className="text-2xl mb-1">⏱️</div>
          <div className="text-2xl font-bold text-gold">{user.totalStudyMinutes}</div>
          <div className="text-cream/50 text-xs">Study Mins</div>
        </div>
        <div className="glass rounded-xl p-3 text-center border border-green-400/30 hover:border-green-400 transition-colors">
          <div className="text-2xl mb-1">{user.streak > 0 ? '🔥' : '❄️'}</div>
          <div className="text-2xl font-bold text-green-400">{user.streak}</div>
          <div className="text-cream/50 text-xs">Day Streak</div>
        </div>
      </div>

      {/* Focus Zones Section */}
      <section className="mb-8">
        {/* Zellige photo section header */}
        <div className="relative rounded-xl overflow-hidden mb-4 h-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/zellige-bg.jpg')", backgroundPositionY: '20%' }}
          />
          <div className="absolute inset-0 bg-night/68 flex items-center px-4 gap-3">
            <span className="text-2xl">🧘</span>
            <h2 className="font-display font-bold text-xl text-gold gold-glow">Focus Zones</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {focusZones.map((zone) => (
            <FocusZoneCard
              key={zone.id}
              zone={zone}
              onClick={() => onFocusZoneClick(zone)}
            />
          ))}
        </div>
      </section>

      {/* Academic Districts Section */}
      <section className="mb-8">
        {/* Zellige photo section header */}
        <div className="relative rounded-xl overflow-hidden mb-4 h-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/zellige-bg.jpg')", backgroundPositionY: '65%' }}
          />
          <div className="absolute inset-0 bg-night/68 flex items-center px-4 gap-3">
            <span className="text-2xl">🎓</span>
            <h2 className="font-display font-bold text-xl text-gold gold-glow">Academic Districts</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {districts.map((district, index) => (
            <div key={district.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <DistrictCard
                district={district}
                onClick={() => onDistrictClick(district)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Quests & Leaderboard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Quests */}
        <section>
          <h2 className="font-display font-bold text-2xl text-gold mb-4 flex items-center gap-2 gold-glow">
            <span>⚔️</span> Active Quests
          </h2>
          <div className="space-y-3">
            {quests.slice(0, 4).map((quest, index) => (
              <div key={quest.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <QuestCard quest={quest} />
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <section>
          <Leaderboard entries={leaderboard} />
        </section>
      </div>

      </div>
    </div>
  );
};

export default DashboardScreen;

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FocusZone, UserState } from '../types';
import GameHUD from './GameHUD';

interface FocusZoneScreenProps {
  zone: FocusZone;
  onBack: (studyMinutes: number) => void;
  user: UserState;
}

/* ─── Static virtual students per zone ─── */
const LIBRARY_STUDENTS = [
  { name: 'Fatima Z.', avatar: '👩‍🎓', subject: 'Medicine', mins: 42, desk: 'left' },
  { name: 'Youssef A.', avatar: '🧑‍💻', subject: 'CS & IT', mins: 17, desk: 'left' },
  { name: 'Sara M.', avatar: '👩‍🔬', subject: 'Engineering', mins: 31, desk: 'right' },
  { name: 'Karim B.', avatar: '🧑‍🏫', subject: 'Mathematics', mins: 55, desk: 'right' },
  { name: 'Amina L.', avatar: '👩‍💼', subject: 'Business', mins: 8, desk: 'center' },
];

const CAFE_STUDENTS = [
  { name: 'Omar T.', avatar: '🧑‍🎨', subject: 'Arts', drink: '☕', table: 'window' },
  { name: 'Leila H.', avatar: '👩‍⚖️', subject: 'Law', drink: '🧃', table: 'center' },
  { name: 'Anas R.', avatar: '🧑‍💻', subject: 'CS & IT', drink: '☕', table: 'corner' },
];

const NIGHT_STUDENTS = [
  { name: 'Hassan I.', avatar: '🧑‍💻', subject: 'CS', lamp: '🟡' },
  { name: 'Nour B.', avatar: '👩‍⚕️', subject: 'Medicine', lamp: '🔵' },
];

/* ─── Book spine colours ─── */
const BOOK_COLORS = [
  '#8B4513','#A0522D','#CD853F','#DEB887','#D2691E',
  '#3D84A8','#5A6E7F','#E07A5F','#6B7C6B','#7B5EA7',
  '#C0392B','#2C3E50','#8E44AD','#16A085','#D35400',
];

/* ─── Seeded positions so they don't re-randomize on re-render ─── */
function seededPositions(n: number, seed = 1) {
  const out = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    out.push(Math.abs(s % 100) / 100);
  }
  return out;
}

/* ═══════════════════════════════════════════════════════ */
const FocusZoneScreen: React.FC<FocusZoneScreenProps> = ({ zone, onBack, user }) => {
  const [visible, setVisible] = useState(false);
  const [timerState, setTimerState] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [selectedMins, setSelectedMins] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalStudied, setTotalStudied] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* stable particle positions */
  const dustX  = useMemo(() => seededPositions(18, 42),  []);
  const dustY  = useMemo(() => seededPositions(18, 77),  []);
  const starX  = useMemo(() => seededPositions(40, 13),  []);
  const starY  = useMemo(() => seededPositions(40, 29),  []);
  const bookH  = useMemo(() => seededPositions(22, 55).map(v => 36 + Math.round(v * 32)), []);

  useEffect(() => { setVisible(true); }, []);

  useEffect(() => {
    if (timerState !== 'running') return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerState('completed');
          setSessionCount(c => c + 1);
          setTotalStudied(t => t + selectedMins);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerState, selectedMins]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const progress = 1 - timeLeft / (selectedMins * 60);

  const handleStart  = () => setTimerState('running');
  const handlePause  = () => setTimerState('paused');
  const handleResume = () => setTimerState('running');
  const handleReset  = () => { setTimerState('idle'); setTimeLeft(selectedMins * 60); };
  const handleLeave  = () => { if (intervalRef.current) clearInterval(intervalRef.current); onBack(totalStudied); };
  const pickMins     = (m: number) => { setSelectedMins(m); setTimeLeft(m * 60); setTimerState('idle'); };

  /* ── Shared timer card ── */
  const TimerCard = ({ accentClass, label }: { accentClass: string; label: string }) => (
    <div className={`glass-dark rounded-2xl p-5 md:p-7 border shadow-2xl ${accentClass} min-w-[200px] text-center`}>
      {/* Circular progress ring */}
      <div className="relative w-36 h-36 mx-auto mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
          <circle
            cx="50" cy="50" r="44" fill="none"
            stroke="url(#tg)" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          <defs>
            <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F2CC8F"/>
              <stop offset="100%" stopColor="#E07A5F"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-bold text-3xl text-gold gold-glow">{fmt(timeLeft)}</span>
          <span className="text-cream/50 text-xs mt-1">{label}</span>
        </div>
      </div>

      {/* Duration pickers */}
      {timerState === 'idle' && (
        <div className="flex justify-center gap-2 mb-4">
          {[15,25,45,60].map(m => (
            <button key={m} onClick={() => pickMins(m)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedMins===m ? 'bg-gold text-night' : 'glass text-cream/70 hover:text-cream'}`}>
              {m}m
            </button>
          ))}
        </div>
      )}

      {/* Control buttons */}
      <div className="flex justify-center gap-3">
        {timerState === 'idle' && (
          <button onClick={handleStart}
            className="px-6 py-2.5 bg-gradient-to-r from-turquoise to-teal-400 text-white font-bold rounded-full hover:scale-105 transition-transform text-sm animate-pulse-glow">
            🎯 Start
          </button>
        )}
        {timerState === 'running' && (
          <button onClick={handlePause}
            className="px-6 py-2.5 bg-gradient-to-r from-terracotta to-orange-400 text-white font-bold rounded-full hover:scale-105 transition-transform text-sm">
            ⏸ Pause
          </button>
        )}
        {timerState === 'paused' && (
          <>
            <button onClick={handleResume}
              className="px-5 py-2.5 bg-gradient-to-r from-turquoise to-teal-400 text-white font-bold rounded-full hover:scale-105 transition-transform text-sm">
              ▶ Resume
            </button>
            <button onClick={handleReset}
              className="px-5 py-2.5 glass text-cream font-bold rounded-full hover:scale-105 transition-transform text-sm">
              ↺ Reset
            </button>
          </>
        )}
        {timerState === 'completed' && (
          <button onClick={handleReset}
            className="px-6 py-2.5 bg-gradient-to-r from-gold to-yellow-400 text-night font-bold rounded-full animate-pulse-glow hover:scale-105 transition-transform text-sm">
            🎉 Again!
          </button>
        )}
      </div>

      {timerState === 'idle' && (
        <p className="text-cream/30 text-xs mt-3">
          +{selectedMins*5} XP · +{selectedMins*2} 🪙
        </p>
      )}
      {timerState === 'completed' && (
        <p className="text-gold font-bold text-sm mt-2 animate-pulse">Session Complete! 🎊</p>
      )}
    </div>
  );

  /* ════════════════════════════════════════
     LIBRARY ZONE
  ════════════════════════════════════════ */
  const LibraryZone = () => (
    <div className="relative rounded-3xl overflow-hidden border border-amber-900/40 shadow-2xl mb-6">
      {/* Sky/window outside */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f05] via-[#2d1b0e] to-[#3a2412]" />

      {/* Zellige accent on top wall */}
      <div className="absolute top-0 left-0 right-0 h-6 zellige-strip opacity-30" />

      {/* Ceiling & upper wall warmth */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-amber-900/40 to-transparent" />

      {/* Chandelier */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
        <div className="w-px h-6 bg-amber-700/60" />
        <div className="text-2xl filter drop-shadow-[0_0_12px_rgba(255,200,80,0.9)]">🏮</div>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-12 rounded-full bg-amber-400/8 blur-xl pointer-events-none" />
      </div>

      {/* Bookshelf — back wall */}
      <div className="absolute top-12 left-0 right-0 h-28 flex items-end px-2 gap-0.5 overflow-hidden">
        {bookH.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm"
            style={{ height: h, backgroundColor: BOOK_COLORS[i % BOOK_COLORS.length], opacity: 0.85 }} />
        ))}
      </div>
      {/* Shelf plank */}
      <div className="absolute top-[156px] left-0 right-0 h-3 bg-amber-900/80" />

      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#2a1505] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#1a0f05]" />

      {/* ── Student rows ── */}
      <div className="relative z-10 px-3 pt-[168px] pb-4 min-h-[460px]">

        {/* Row label */}
        <div className="text-center mb-3">
          <span className="text-amber-400/60 text-xs tracking-widest uppercase">— Reading Room —</span>
        </div>

        {/* Other students desks */}
        <div className="flex justify-around items-end gap-2 mb-4">
          {LIBRARY_STUDENTS.slice(0,4).map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {/* Student bubble */}
              <div className="relative">
                <div className="glass-dark rounded-xl px-2 py-1 border border-amber-800/30 text-center">
                  <div className="text-lg">{s.avatar}</div>
                  <div className="text-cream/80 text-[10px] font-semibold whitespace-nowrap">{s.name}</div>
                  <div className="text-amber-400/70 text-[9px]">{s.subject}</div>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400/80 text-[9px]">{s.mins}m</span>
                  </div>
                </div>
                {/* Mini desk lamp */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-amber-800/60 rounded" />
              </div>
              {/* Desk surface */}
              <div className="w-16 h-2 rounded-t bg-amber-900/70 border-t border-amber-700/30" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-amber-900/30" />
          <span className="text-amber-600/50 text-xs">YOUR SEAT</span>
          <div className="h-px flex-1 bg-amber-900/30" />
        </div>

        {/* YOUR DESK — prominent */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Desk scene */}
          <div className="relative flex flex-col items-center">
            {/* Lamp + glow */}
            <div className="relative mb-1">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-10 rounded-full bg-amber-400/15 blur-lg" />
              <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,200,80,0.8)]">🪔</span>
            </div>
            {/* Open books */}
            <div className="flex gap-1 mb-1">
              <span className="text-xl">📖</span>
              <span className="text-xl">📝</span>
            </div>
            {/* Desk plank */}
            <div className="w-32 h-3 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t border-t border-amber-600/40" />
            <div className="text-cream/40 text-xs mt-1">{user.avatar} {user.name}</div>
          </div>

          {/* Timer card */}
          <TimerCard
            accentClass="border-amber-700/40"
            label={timerState === 'running' ? '📚 Deep Focus' : timerState === 'completed' ? '✅ Done!' : 'Ready to study'}
          />
        </div>
      </div>

      {/* Dust motes floating */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {dustX.map((x, i) => (
          <div key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-200/20 animate-float"
            style={{ left: `${x*100}%`, top: `${dustY[i]*100}%`, animationDelay: `${i*0.4}s`, animationDuration: `${4+i*0.3}s` }}
          />
        ))}
      </div>
    </div>
  );

  /* ════════════════════════════════════════
     STUDY CAFÉ ZONE
  ════════════════════════════════════════ */
  const CafeZone = () => {
    const [rain, setRain] = useState(true);
    const rainX = useMemo(() => seededPositions(30, 91), []);

    return (
      <div className="relative rounded-3xl overflow-hidden border border-amber-800/30 shadow-2xl mb-6">
        {/* Warm café background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c0e05] via-[#2b1709] to-[#1c0e05]" />

        {/* Zellige wainscot band */}
        <div className="absolute bottom-0 left-0 right-0 h-10 zellige-strip opacity-20" />

        {/* ── Window with outside view ── */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-56 md:w-72 h-32 border-4 border-amber-900/50 rounded-t-2xl overflow-hidden">
          {/* Sky gradient — day or night */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/80 via-indigo-900/60 to-amber-900/40" />
          {/* Minaret silhouette */}
          <div className="absolute bottom-0 left-8 w-6 h-16 bg-night/70 rounded-t-sm" />
          <div className="absolute bottom-16 left-8 w-6 h-3 bg-night/70 rounded-full" />
          <div className="absolute bottom-0 right-12 w-4 h-20 bg-night/60 rounded-t-sm" />
          {/* Palm */}
          <div className="absolute bottom-0 right-4 text-xl">🌴</div>
          {/* Stars */}
          {starX.slice(0,12).map((x,i) => (
            <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
              style={{ left:`${x*100}%`, top:`${starY[i]*70}%`, animationDelay:`${i*0.3}s` }} />
          ))}
          {/* Rain */}
          {rain && rainX.map((x,i) => (
            <div key={i}
              className="absolute w-px h-3 bg-blue-300/40 rounded-full animate-rain"
              style={{ left:`${x*100}%`, animationDelay:`${(i*0.08)%2}s` }} />
          ))}
          {/* Rain toggle */}
          <button
            onClick={() => setRain(r => !r)}
            className="absolute top-1 right-1 text-xs glass-dark rounded px-1.5 py-0.5 text-cream/60 hover:text-gold transition-colors">
            {rain ? '🌧️' : '☀️'}
          </button>
        </div>

        {/* Chalkboard menu on wall */}
        <div className="absolute top-4 left-2 w-20 md:w-24 bg-[#1a3a2a] border-2 border-amber-900/40 rounded p-1 text-center">
          <div className="text-cream/60 text-[8px] font-bold tracking-wider border-b border-cream/10 pb-0.5 mb-0.5">MENU</div>
          <div className="text-cream/50 text-[7px] leading-3">☕ Qahwa</div>
          <div className="text-cream/50 text-[7px] leading-3">🍵 Atay</div>
          <div className="text-cream/50 text-[7px] leading-3">🍋 Limonada</div>
        </div>

        {/* Hanging lanterns */}
        <div className="absolute top-2 left-6 text-xl opacity-70 filter drop-shadow-[0_0_8px_rgba(255,160,40,0.6)]">🏮</div>
        <div className="absolute top-2 right-6 text-xl opacity-70 filter drop-shadow-[0_0_8px_rgba(255,160,40,0.6)]">🏮</div>

        {/* ── Other students at tables ── */}
        <div className="relative z-10 px-4 pt-44 pb-4 min-h-[440px]">

          <div className="text-center mb-4">
            <span className="text-amber-500/50 text-xs tracking-widest uppercase">— Study Café —</span>
          </div>

          {/* Other student tables */}
          <div className="flex justify-around gap-2 mb-6">
            {CAFE_STUDENTS.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="glass-dark rounded-xl p-2 border border-amber-800/30 text-center min-w-[70px]">
                  <div className="text-xl">{s.avatar}</div>
                  <div className="text-cream/80 text-[10px] font-semibold">{s.name}</div>
                  <div className="text-amber-400/60 text-[8px]">{s.subject}</div>
                  <div className="text-lg mt-0.5">{s.drink}</div>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400/70 text-[8px]">online</span>
                  </div>
                </div>
                {/* Table */}
                <div className="w-16 h-2.5 rounded-t bg-amber-900/70 border-t border-amber-700/40" />
                <div className="w-1 h-3 bg-amber-900/50" />
              </div>
            ))}
          </div>

          {/* YOUR TABLE */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Table scene */}
            <div className="flex flex-col items-center">
              <div className="flex gap-3 items-end mb-1">
                <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(200,130,80,0.6)]">☕</span>
                <span className="text-xl">📓</span>
                <span className="text-lg">🖊️</span>
              </div>
              <div className="w-36 h-3 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t border-t border-amber-600/30" />
              <div className="text-cream/40 text-xs mt-1">{user.avatar} Your Table</div>
            </div>
            <TimerCard
              accentClass="border-terracotta/30"
              label={timerState === 'running' ? '☕ Café Focus' : timerState === 'completed' ? '🎉 Done!' : 'Relax & Study'}
            />
          </div>
        </div>

        {/* Warm floor */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-amber-950/80 to-transparent" />
      </div>
    );
  };

  /* ════════════════════════════════════════
     NIGHT FOCUS ZONE
  ════════════════════════════════════════ */
  const NightZone = () => (
    <div className="relative rounded-3xl overflow-hidden border border-indigo-900/50 shadow-2xl mb-6">
      {/* Deep night sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04040f] via-[#080820] to-[#050510]" />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {starX.map((x,i) => (
          <div key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: i%5===0?'2px':'1px', height: i%5===0?'2px':'1px',
              left:`${x*100}%`, top:`${starY[i]*60}%`,
              animationDelay:`${i*0.15}s`, animationDuration:`${2+i*0.1}s`,
              opacity: 0.4+starX[(i+5)%40]*0.6
            }} />
        ))}
      </div>

      {/* Moon */}
      <div className="absolute top-6 right-10 w-12 h-12 rounded-full bg-gradient-to-br from-amber-50 to-amber-100/90 shadow-[0_0_30px_rgba(255,245,200,0.3)]">
        <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-amber-200/30" />
        <div className="absolute top-4 right-1 w-3 h-3 rounded-full bg-amber-200/20" />
      </div>

      {/* Moonbeam */}
      <div className="absolute top-18 right-14 w-6 h-48 bg-gradient-to-b from-amber-100/6 to-transparent rotate-6 blur-sm pointer-events-none" />

      {/* ── Large window with moon view ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-44 md:w-60 h-36 border-4 border-indigo-900/40 rounded-t-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#04040f]/70 to-[#04040f]/90" />
        {/* Window cross bars */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-indigo-900/40" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-full bg-indigo-900/40" />
        </div>
        {/* City silhouette */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 px-1">
          {[12,18,10,22,14,8,16,11].map((h,i)=>(
            <div key={i} className="bg-[#02020a]/90" style={{width:'10%',height:`${h}px`}} />
          ))}
        </div>
      </div>

      {/* Zellige border band */}
      <div className="absolute bottom-0 left-0 right-0 h-8 zellige-strip opacity-10" />

      {/* Night owl students — glowing faintly */}
      <div className="absolute right-3 top-46 flex flex-col gap-2">
        <div className="text-[10px] text-indigo-400/40 text-right">Night Owls 🦉</div>
        {NIGHT_STUDENTS.map((s,i)=>(
          <div key={i} className="flex items-center gap-1.5 justify-end">
            <div className="text-right">
              <div className="text-cream/40 text-[9px] font-semibold">{s.name}</div>
              <div className="text-indigo-400/40 text-[8px]">{s.subject}</div>
            </div>
            <div className="text-sm opacity-50 filter drop-shadow-[0_0_4px_rgba(150,150,255,0.5)]">{s.avatar}</div>
          </div>
        ))}
      </div>

      {/* Do Not Disturb badge */}
      <div className="absolute left-3 top-[180px] glass-dark rounded-lg px-2 py-1 border border-red-900/30">
        <div className="text-red-400/70 text-[9px] font-bold tracking-wider">🔕 DND MODE</div>
        <div className="text-cream/30 text-[8px]">Deep focus on</div>
      </div>

      {/* ── Your desk scene ── */}
      <div className="relative z-10 px-4 pt-48 pb-4 min-h-[440px]">

        <div className="text-center mb-5">
          <span className="text-indigo-400/40 text-xs tracking-widest uppercase">— Night Focus —</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Desk scene */}
          <div className="flex flex-col items-center">
            {/* Desk lamp with glow */}
            <div className="relative mb-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-12 rounded-full bg-amber-400/10 blur-xl" />
              <div className="flex items-end gap-1">
                <div className="w-px h-8 bg-amber-700/60" />
                <div className="w-8 h-4 bg-amber-800/70 rounded-tl-full rounded-bl-sm -rotate-12 origin-right" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-800/60 rounded" />
            </div>
            {/* Desk items */}
            <div className="flex gap-2 items-end mb-1">
              <span className="text-xl">📋</span>
              <span className="text-lg filter drop-shadow-[0_0_6px_rgba(255,220,100,0.7)]">🔦</span>
              <span className="text-xl">🖊️</span>
            </div>
            <div className="w-36 h-3 bg-gradient-to-b from-[#1a0e05] to-[#120a03] rounded-t border-t border-amber-900/30" />
            <div className="text-cream/30 text-xs mt-1">{user.avatar} Your Station</div>
          </div>

          <TimerCard
            accentClass="border-indigo-500/30"
            label={timerState === 'running' ? '🌙 Exam Mode' : timerState === 'completed' ? '🌟 Excellent!' : 'Deep Focus'}
          />
        </div>
      </div>
    </div>
  );

  /* ── Map zone.id → component ── */
  const ZoneScene = zone.id === 'cafe' ? CafeZone : zone.id === 'night' ? NightZone : LibraryZone;

  /* ── Zone theme colours ── */
  const themeAccent = zone.id === 'cafe'
    ? 'text-terracotta'
    : zone.id === 'night'
      ? 'text-indigo-300'
      : 'text-amber-400';

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* HUD */}
      <div className="mb-4">
        <GameHUD user={user} compact />
      </div>

      {/* Back & header row */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handleLeave}
          className="flex items-center gap-2 text-cream/60 hover:text-gold transition-colors group glass px-4 py-2 rounded-full text-sm">
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Leave Zone
        </button>
        <div className="text-center">
          <span className="text-2xl">{zone.emoji}</span>
          <span className={`font-display font-bold text-lg ml-2 ${themeAccent}`}>{zone.name}</span>
        </div>
        {/* Session stats pills */}
        <div className="flex gap-2">
          <div className="glass rounded-full px-3 py-1 text-xs text-cream/70">
            <span className="text-gold font-bold">{sessionCount}</span> sessions
          </div>
          <div className="glass rounded-full px-3 py-1 text-xs text-cream/70">
            <span className="text-turquoise font-bold">{totalStudied}</span> mins
          </div>
        </div>
      </div>

      {/* Immersive zone scene — dreamy fade+zoom entrance */}
      <div className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <ZoneScene />
      </div>
    </div>
  );
};

export default FocusZoneScreen;

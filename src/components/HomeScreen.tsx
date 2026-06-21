import React from 'react';
import { Settings, Info } from 'lucide-react';

interface HomeScreenProps {
  userName: string;
  sessionCount: number;
  onBeginSession: () => void;
  onOpenSettings: () => void;
}

const quotes = [
  'You don\'t need to understand everything now. Just be here.',
  'Every small step is still a step forward.',
  'It\'s okay to take things one moment at a time.',
  'Healing is not linear, and that\'s okay.',
  'You are stronger than you know.',
  'Today, give yourself permission to rest.',
  'Progress isn\'t always visible, but it\'s always happening.',
  'Be gentle with yourself. You\'re doing the best you can.',
  'The bravest thing you can do is show up.',
  'You don\'t have to be perfect to be worthy.',
  'Breathe. You are exactly where you need to be.',
  'Small moments of peace add up to something beautiful.',
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getGreeting(): string {
  const hours = new Date().getHours();
  if (hours < 12) return 'Good morning,';
  if (hours < 17) return 'Good afternoon,';
  return 'Good evening,';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  sessionCount,
  onBeginSession,
  onOpenSettings,
}) => {
  const greeting = getGreeting();
  const displayName = userName.trim() || 'there';
  const dailyQuote = quotes[getDayOfYear() % quotes.length];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100svh',
        padding: '24px 28px',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Settings
          size={20}
          color="#2d2d2d"
          style={{ cursor: 'pointer' }}
          onClick={onOpenSettings}
        />
        <Info size={20} color="#2d2d2d" style={{ cursor: 'pointer' }} />
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: 40,
          height: 2,
          background: '#2d2d2d',
          marginTop: 32,
        }}
      />

      {/* Greeting */}
      <div
        style={{
          fontSize: '2rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          lineHeight: 1.2,
          color: '#1a1a1a',
          marginTop: 24,
        }}
      >
        <div>{greeting}</div>
        <div>{displayName}.</div>
      </div>

      {/* Daily thought */}
      <div className="section-label" style={{ marginTop: 40 }}>
        A THOUGHT FOR TODAY
      </div>
      <div
        style={{
          fontSize: '1rem',
          color: '#3a3a3a',
          lineHeight: 1.5,
          marginTop: 8,
        }}
      >
        {dailyQuote}
      </div>

      {/* Sessions counter */}
      <div className="section-label" style={{ marginTop: 48 }}>
        SESSIONS COMPLETED
      </div>
      <div
        style={{
          fontSize: '2.5rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          color: '#1a1a1a',
          marginTop: 4,
        }}
      >
        {sessionCount} session{sessionCount !== 1 ? 's' : ''}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Begin button */}
      <button
        className="btn-outline"
        style={{
          width: '100%',
          padding: 18,
          fontSize: '1rem',
          color: 'var(--color-accent)',
          borderColor: 'var(--color-accent)',
          fontWeight: 500,
        }}
        onClick={onBeginSession}
      >
        Begin a session
      </button>

      {/* Bottom safe spacer */}
      <div style={{ height: 24 }} />
    </div>
  );
};

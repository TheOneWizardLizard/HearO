import React from 'react';
import { Coffee, Car, Waves, Trees, ShieldAlert, Shuffle, ArrowLeft, Music, Volume2, Zap } from 'lucide-react';
import type { ExposureType, AudioEngineSettings } from '../utils/audioEngine';
import { NOISE_VARIANT_COUNT, TRIGGER_TYPES } from '../utils/audioEngine';

interface SessionSetupProps {
  settings: AudioEngineSettings;
  duration: number; // in minutes
  initialSuds: number;
  onSettingsChange: (newSettings: Partial<AudioEngineSettings>) => void;
  onDurationChange: (duration: number) => void;
  onInitialSudsChange: (suds: number) => void;
  onStartSession: () => void;
  onTriggerSOS: () => void;
  onBack: () => void;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({
  settings,
  duration,
  initialSuds,
  onSettingsChange,
  onDurationChange,
  onInitialSudsChange,
  onStartSession,
  onTriggerSOS,
  onBack,
}) => {
  const environments: { type: ExposureType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      type: 'cafe',
      label: 'Cafe',
      icon: <Coffee size={20} />,
      desc: 'Muffled chatter and clinking cups',
    },
    {
      type: 'street',
      label: 'Busy Street',
      icon: <Car size={20} />,
      desc: 'Car traffic and city bustle',
    },
    {
      type: 'beach',
      label: 'Sea Beach',
      icon: <Waves size={20} />,
      desc: 'Soothing wave sounds and ocean breeze',
    },
    {
      type: 'forest',
      label: 'Quiet Forest',
      icon: <Trees size={20} />,
      desc: 'Rustling leaves, chirping birds, and wind',
    },
  ];

  const getSudsDescription = (val: number): string => {
    if (val <= 2) return 'Calm and relaxed';
    if (val <= 4) return 'Mild tension or slight discomfort';
    if (val <= 6) return 'Moderate tension, noticeable but controlled';
    if (val <= 8) return 'High tension, strong urge to avoid';
    return 'Extreme tension, difficulty concentrating / panic';
  };

  const getSpikeLabel = (val: number): string => {
    if (val === 0) return 'No sudden noises';
    if (val === 1) return '1 sudden noise';
    return `${val} sudden noises`;
  };

  return (
    <div className="view-container" style={{ position: 'relative', zIndex: 10 }}>
      {/* Top bar with Back Button */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px 0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family)',
            fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Introduction */}
      <div style={{ marginTop: 12, marginBottom: 8 }}>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Session Setup
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
          Configure your soundscape. Regular practice builds resilience.
        </p>
      </div>

      {/* ===== LAYER 1: BACKGROUND MUSIC ===== */}
      <div style={{ marginTop: 16 }}>
        <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Music size={14} />
          Layer 1 — Background Music
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4, marginBottom: 12 }}>
          A constant soothing melody that plays throughout the session.
        </p>

        {/* Music Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Enable Background Music</span>
          <button
            className={`pill-btn ${settings.musicEnabled ? 'active' : ''}`}
            onClick={() => onSettingsChange({ musicEnabled: !settings.musicEnabled })}
            style={{ minWidth: 60 }}
          >
            {settings.musicEnabled ? 'On' : 'Off'}
          </button>
        </div>

        {/* Music Volume — only visible when enabled */}
        {settings.musicEnabled && (
          <div className="control-group">
            <div className="control-header">
              <span>Music Volume</span>
              <span className="control-value">{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => onSettingsChange({ musicVolume: parseFloat(e.target.value) })}
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-border-subtle)', marginTop: 20, marginBottom: 20 }} />

      {/* ===== LAYER 2: AMBIENT ENVIRONMENT ===== */}
      <div>
        <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Volume2 size={14} />
          Layer 2 — Ambient Environment
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4, marginBottom: 12 }}>
          Choose the environment situation and set its volume and muffle level.
        </p>

        {/* Environment Selector */}
        <div className="env-grid" style={{ marginTop: 8 }}>
          {environments.map((env) => {
            const isActive = settings.exposureType === env.type;
            return (
              <div
                key={env.type}
                className={`env-card ${isActive ? 'selected' : ''}`}
                onClick={() => onSettingsChange({ exposureType: env.type })}
              >
                <div 
                  className="env-icon"
                  style={{
                    color: isActive ? 'var(--color-accent)' : 'var(--text-secondary)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  {env.icon}
                </div>
                <div className="env-name">{env.label}</div>
                <div className="env-desc">{env.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Noise Variant Selector */}
        <div className="control-group" style={{ marginTop: 12 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 6 }}>Background Noise Variant</div>
          <div className="pill-group" style={{ marginTop: 4 }}>
            <button
              className={`pill-btn ${settings.noiseVariantIndex === -1 ? 'active' : ''}`}
              onClick={() => onSettingsChange({ noiseVariantIndex: -1 })}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Shuffle size={12} />
              Random
            </button>
            {Array.from({ length: NOISE_VARIANT_COUNT }, (_, i) => (
              <button
                key={i}
                className={`pill-btn ${settings.noiseVariantIndex === i ? 'active' : ''}`}
                onClick={() => onSettingsChange({ noiseVariantIndex: i })}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {settings.noiseVariantIndex === -1
              ? 'A different noise variant is chosen for each session'
              : `Variant ${settings.noiseVariantIndex + 1} selected`}
          </span>
        </div>

        {/* Noise Volume */}
        <div className="control-group" style={{ marginTop: 12 }}>
          <div className="control-header">
            <span>Environment Volume</span>
            <span className="control-value">{Math.round(settings.noiseVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.noiseVolume}
            onChange={(e) => onSettingsChange({ noiseVolume: parseFloat(e.target.value) })}
          />
        </div>

        {/* Noise Muffle Level */}
        <div className="control-group" style={{ marginTop: 12 }}>
          <div className="control-header">
            <span>Environment Muffle</span>
            <span className="control-value">{Math.round(settings.muffleLevel * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.muffleLevel}
            onChange={(e) => onSettingsChange({ muffleLevel: parseFloat(e.target.value) })}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            High muffle attenuates high frequencies, providing distance.
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-border-subtle)', marginTop: 20, marginBottom: 20 }} />

      {/* ===== LAYER 3: TRIGGER SOUND ===== */}
      <div>
        <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={14} />
          Layer 3 — Trigger Sound
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4, marginBottom: 12 }}>
          Choose a single trigger type, how many times it plays, and its volume/muffle level.
        </p>

        {/* Trigger Selector — Individual labeled buttons */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 8 }}>Select Trigger</div>
        <div className="pill-group" style={{ flexWrap: 'wrap', gap: 8 }}>
          {TRIGGER_TYPES.map((t) => (
            <button
              key={t.type}
              className={`pill-btn ${settings.selectedTrigger === t.type ? 'active' : ''}`}
              onClick={() => onSettingsChange({ selectedTrigger: t.type })}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Trigger-specific controls — hidden when "None" is selected */}
        {settings.selectedTrigger !== 'none' && (
          <>
            {/* Triggers per Session */}
            <div className="control-group" style={{ marginTop: 16 }}>
              <div className="control-header">
                <span>Triggers per Session</span>
                <span className="control-value">{settings.spikeCount}</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={settings.spikeCount}
                onChange={(e) => onSettingsChange({ spikeCount: parseInt(e.target.value) })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {getSpikeLabel(settings.spikeCount)}
              </span>
            </div>

            {/* Trigger Volume */}
            <div className="control-group" style={{ marginTop: 12 }}>
              <div className="control-header">
                <span>Trigger Volume</span>
                <span className="control-value">{Math.round(settings.triggerVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.triggerVolume}
                onChange={(e) => onSettingsChange({ triggerVolume: parseFloat(e.target.value) })}
              />
            </div>

            {/* Trigger Muffle Level */}
            <div className="control-group" style={{ marginTop: 12 }}>
              <div className="control-header">
                <span>Trigger Muffle</span>
                <span className="control-value">{Math.round(settings.triggerMuffleLevel * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.triggerMuffleLevel}
                onChange={(e) => onSettingsChange({ triggerMuffleLevel: parseFloat(e.target.value) })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Higher values muffle the trigger, making it feel more distant.
              </span>
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-border-subtle)', marginTop: 20, marginBottom: 20 }} />

      {/* Language Selector */}
      <div className="control-group">
        <div className="section-label">Guidance Language</div>
        <div className="pill-group" style={{ marginTop: 8 }}>
          <button
            className={`pill-btn ${settings.voiceoverLanguage === 'he' ? 'active' : ''}`}
            onClick={() => onSettingsChange({ voiceoverLanguage: 'he' })}
          >
            Hebrew
          </button>
          <button
            className={`pill-btn ${settings.voiceoverLanguage === 'en' ? 'active' : ''}`}
            onClick={() => onSettingsChange({ voiceoverLanguage: 'en' })}
          >
            English
          </button>
        </div>
      </div>

      {/* Duration Selector */}
      <div className="control-group" style={{ marginTop: 16 }}>
        <div className="section-label">Session Duration</div>
        <div className="pill-group" style={{ marginTop: 8 }}>
          {[3, 5, 10, 15].map((mins) => {
            const isSelected = duration === mins;
            return (
              <button
                key={mins}
                className={`pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onDurationChange(mins)}
              >
                {mins} mins
              </button>
            );
          })}
        </div>
      </div>

      {/* SUDs Stress rating */}
      <div className="control-group" style={{ marginTop: 16 }}>
        <div className="section-label">Current State (Stress/Anxiety)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
          <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', width: 48 }}>
            {initialSuds}
          </div>
          <div style={{ flex: 1 }}>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={initialSuds}
              onChange={(e) => onInitialSudsChange(parseInt(e.target.value))}
              style={{
                background: 'linear-gradient(90deg, #b4c7b5 0%, #dcd3c5 50%, #dca5a5 100%)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Calm (0)</span>
              <span>Panic (10)</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          {getSudsDescription(initialSuds)}
        </div>
      </div>

      {/* Action Buttons */}
      <button 
        className="btn-filled" 
        style={{ marginTop: 32 }}
        onClick={onStartSession}
      >
        Start Session
      </button>

      <button 
        className="btn-outline sos" 
        style={{ marginTop: 8 }}
        onClick={onTriggerSOS}
      >
        <ShieldAlert size={18} />
        Emergency SOS
      </button>
      
      {/* Footer Nav spacer */}
      <div style={{ height: '40px' }}></div>
    </div>
  );
};

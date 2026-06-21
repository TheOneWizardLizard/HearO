import React from 'react';
import { Coffee, Car, Waves, Trees, ShieldAlert, Shuffle, ArrowLeft } from 'lucide-react';
import type { ExposureType, AudioEngineSettings } from '../utils/audioEngine';
import { NOISE_VARIANT_COUNT } from '../utils/audioEngine';

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

      {/* Environment Selector */}
      <div className="control-group" style={{ marginTop: 12 }}>
        <div className="section-label">Exposure Environment</div>
        <div className="env-grid" style={{ marginTop: 12 }}>
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
      </div>

      {/* Noise Variant Selector */}
      <div className="control-group" style={{ marginTop: 16 }}>
        <div className="section-label">Background Noise Variant</div>
        <div className="pill-group" style={{ marginTop: 8 }}>
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

      {/* Audio Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
        <div className="section-label">Audio Controls</div>

        {/* Music Volume */}
        <div className="control-group">
          <div className="control-header">
            <span>Soothing Music</span>
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

        {/* Noise Volume */}
        <div className="control-group">
          <div className="control-header">
            <span>Background Noise</span>
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

        {/* Muffle Level */}
        <div className="control-group">
          <div className="control-header">
            <span>Noise Muffle Level</span>
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

        {/* Spike Triggers Count */}
        <div className="control-group">
          <div className="control-header">
            <span>Sudden Noises per Session</span>
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
            Status: {getSpikeLabel(settings.spikeCount)}
          </span>
        </div>
      </div>

      {/* Language Selector */}
      <div className="control-group" style={{ marginTop: 16 }}>
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

import React, { useState, useEffect } from 'react';
import { Smile, Trash2, Award } from 'lucide-react';
import type { ExposureType } from '../utils/audioEngine';

export interface SessionLog {
  id: string;
  date: string;
  environment: ExposureType;
  duration: number; // in minutes
  initialSuds: number;
  finalSuds: number;
}

interface SessionHistoryProps {
  onClearHistory: () => void;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({ onClearHistory }) => {
  const [logs, setLogs] = useState<SessionLog[]>([]);

  useEffect(() => {
    const fetchLogs = () => {
      const savedLogs = localStorage.getItem('hearo_session_logs');
      if (savedLogs) {
        try {
          setLogs(JSON.parse(savedLogs));
        } catch (e) {}
      }
    };
    fetchLogs();
  }, []);

  const getEnvLabel = (type: ExposureType) => {
    switch (type) {
      case 'cafe': return 'Cafe';
      case 'street': return 'Busy Street';
      case 'beach': return 'Sea Beach';
      case 'forest': return 'Quiet Forest';
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all session history? This action cannot be undone.')) {
      onClearHistory();
      setLogs([]);
    }
  };

  const totalSessions = logs.length;
  const totalMinutes = logs.reduce((acc, log) => acc + log.duration, 0);
  
  const improvements = logs.map(log => log.initialSuds - log.finalSuds);
  const avgImprovement = improvements.length > 0 
    ? Math.round((improvements.reduce((acc, val) => acc + val, 0) / improvements.length) * 10) / 10
    : 0;

  return (
    <div className="view-container" style={{ position: 'relative', zIndex: 10 }}>
      {/* Header */}
      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Progress Log
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
          Track your cumulative exposure sessions and self-regulation progress.
        </p>
      </div>

      {/* Stats Hero Dashboard */}
      {totalSessions > 0 && (
        <div className="stats-hero-row" style={{ marginTop: 8 }}>
          <div className="stat-hero-card">
            <div className="stat-hero-value">{totalSessions}</div>
            <div className="stat-hero-label">Completed</div>
          </div>
          <div className="stat-hero-card">
            <div className="stat-hero-value">
              {Math.round(totalMinutes * 10) / 10}m
            </div>
            <div className="stat-hero-label">Total Time</div>
          </div>
          <div className="stat-hero-card" style={{ gridColumn: 'span 2', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Smile size={18} style={{ color: 'var(--color-accent)' }} />
              <div className="stat-hero-value" style={{ color: 'var(--color-accent)', fontSize: '1.8rem' }}>
                {avgImprovement > 0 ? `+${avgImprovement}` : avgImprovement}
              </div>
            </div>
            <div className="stat-hero-label" style={{ marginTop: 4 }}>Average Stress Reduction (SUDs)</div>
          </div>
        </div>
      )}

      {/* History Log List */}
      <div className="control-group" style={{ marginTop: 16 }}>
        <div className="section-label">Recent Sessions</div>
        
        {logs.length === 0 ? (
          <div className="card-subtle" style={{ textAlign: 'center', padding: '48px 24px', marginTop: 8 }}>
            <Award size={40} style={{ opacity: 0.3, marginBottom: 12, color: 'var(--color-accent)', margin: '0 auto 12px' }} />
            <p style={{ fontWeight: '500', color: 'var(--text-primary)' }}>No sessions recorded yet</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Complete your first session to see your progress logs here.
            </p>
          </div>
        ) : (
          <div className="history-list" style={{ marginTop: 12 }}>
            {logs.map((log) => {
              const stressDiff = log.initialSuds - log.finalSuds;
              
              return (
                <div key={log.id} className="history-item">
                  <div className="history-item-details">
                    <div className="history-item-title">{getEnvLabel(log.environment)}</div>
                    <div className="history-item-meta">
                      {new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="history-item-stats">
                    <div className="history-item-time">{log.duration} min</div>
                    <div 
                      className="history-item-stress-badge"
                      style={{
                        backgroundColor: stressDiff > 0 ? 'var(--color-accent-soft)' : 'rgba(45, 45, 45, 0.05)',
                        color: stressDiff > 0 ? 'var(--color-accent)' : 'var(--text-secondary)',
                        fontWeight: stressDiff > 0 ? '600' : 'normal',
                      }}
                    >
                      {log.initialSuds} ➔ {log.finalSuds} 
                      {stressDiff > 0 ? ` (↓ ${stressDiff})` : stressDiff < 0 ? ` (↑ ${Math.abs(stressDiff)})` : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear Logs Action Button */}
      {logs.length > 0 && (
        <button 
          className="btn-outline sos" 
          style={{ marginTop: 24 }}
          onClick={handleClear}
        >
          <Trash2 size={16} />
          Clear All History
        </button>
      )}
      
      {/* Footer Nav spacer */}
      <div style={{ height: '30px' }}></div>
    </div>
  );
};

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
      case 'cafe': return 'בית קפה';
      case 'street': return 'רחוב סואן';
      case 'beach': return 'חוף הים';
      case 'forest': return 'יער שקט';
    }
  };

  const handleClear = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל היסטוריית הסשנים? פעולה זו אינה ניתנת לביטול.')) {
      onClearHistory();
      setLogs([]);
    }
  };

  // Compile statistics
  const totalSessions = logs.length;
  const totalMinutes = logs.reduce((acc, log) => acc + log.duration, 0);
  
  // Calculate average improvement (initialSuds - finalSuds)
  const improvements = logs.map(log => log.initialSuds - log.finalSuds);
  const avgImprovement = improvements.length > 0 
    ? Math.round((improvements.reduce((acc, val) => acc + val, 0) / improvements.length) * 10) / 10
    : 0;

  return (
    <div className="view-container" style={{ position: 'relative', zIndex: 10 }}>
      <div className="glass-panel" style={{ padding: '24px 20px', textAlign: 'center', borderRadius: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>יומן התקדמות</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
          עקוב אחר משך החשיפה המצטבר ורמת הוויסות העצמי שלך לאורך זמן.
        </p>
      </div>

      {/* Stats Hero Dashboard */}
      {totalSessions > 0 ? (
        <div className="stats-hero-row" style={{ gap: '12px' }}>
          <div className="glass-panel stat-hero-card" style={{ borderRadius: '24px', padding: '20px 12px' }}>
            <div className="stat-hero-value" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{totalSessions}</div>
            <div className="stat-hero-label" style={{ fontWeight: '500' }}>סשנים שהושלמו</div>
          </div>
          <div className="glass-panel stat-hero-card" style={{ borderRadius: '24px', padding: '20px 12px' }}>
            <div className="stat-hero-value" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-secondary)' }}>
              {Math.round(totalMinutes * 10) / 10}
            </div>
            <div className="stat-hero-label" style={{ fontWeight: '500' }}>דקות תרגול</div>
          </div>
          <div className="glass-panel stat-hero-card" style={{ gridColumn: 'span 2', padding: '20px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Smile style={{ color: 'var(--color-accent)' }} />
              <div className="stat-hero-value" style={{ color: 'var(--color-accent)', fontSize: '1.8rem', fontFamily: 'var(--font-display)' }}>
                {avgImprovement > 0 ? `+${avgImprovement}` : avgImprovement}
              </div>
            </div>
            <div className="stat-hero-label" style={{ fontWeight: '500', marginTop: '4px' }}>ירידה ממוצעת ברמת המתח (נק׳ SUDs)</div>
          </div>
        </div>
      ) : null}

      {/* History Log List */}
      <div className="control-group">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', paddingRight: '8px', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>סשנים אחרונים</h3>
        
        {logs.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', borderRadius: '32px' }}>
            <Award size={48} style={{ opacity: 0.3, marginBottom: '12px', color: 'var(--color-primary)' }} />
            <p style={{ fontWeight: '600' }}>אין עדיין סשנים רשומים</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              בצע את סשן החשיפה הראשון שלך כדי להתחיל לתעד את ההתקדמות כאן.
            </p>
          </div>
        ) : (
          <div className="history-list">
            {logs.map((log) => {
              const stressDiff = log.initialSuds - log.finalSuds;
              
              return (
                <div key={log.id} className="history-item" style={{ borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.45)', borderColor: 'rgba(65, 101, 98, 0.08)' }}>
                  <div className="history-item-details">
                    <div className="history-item-title" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{getEnvLabel(log.environment)}</div>
                    <div className="history-item-meta" style={{ fontFamily: 'var(--font-display)' }}>
                      <span>{new Date(log.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  
                  <div className="history-item-stats">
                    <div className="history-item-time" style={{ fontFamily: 'var(--font-display)', fontWeight: '600' }}>{log.duration} דק׳</div>
                    <div 
                      className="history-item-stress-badge"
                      style={{
                        backgroundColor: stressDiff > 0 ? 'var(--color-primary-soft)' : 'rgba(65, 101, 98, 0.06)',
                        color: stressDiff > 0 ? 'var(--color-primary)' : 'var(--text-secondary)',
                        fontWeight: stressDiff > 0 ? '600' : 'normal',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        marginTop: '4px',
                        fontFamily: 'var(--font-display)'
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
          className="btn btn-secondary" 
          style={{ 
            color: 'var(--color-sos)', 
            borderColor: 'var(--color-sos-soft)', 
            backgroundColor: 'rgba(186, 26, 26, 0.05)',
            marginTop: 'auto',
            padding: '14px',
            borderRadius: '9999px',
            fontWeight: '600'
          }}
          onClick={handleClear}
        >
          <Trash2 size={16} />
          מחק את כל ההיסטוריה
        </button>
      )}
      
      {/* Footer Nav spacer */}
      <div style={{ height: '30px' }}></div>
    </div>
  );
};

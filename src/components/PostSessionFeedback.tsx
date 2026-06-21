import React, { useState } from 'react';

interface PostSessionFeedbackProps {
  onComplete: (feedback: {
    difficulty: number | null;
    triggerBothered: string | null;
    notes: string;
  }) => void;
  onSkipAll: () => void;
}

const triggerOptions: { value: string; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'a_little', label: 'A little' },
  { value: 'not_really', label: 'Not really' },
];

export const PostSessionFeedback: React.FC<PostSessionFeedbackProps> = ({
  onComplete,
  onSkipAll,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [triggerBothered, setTriggerBothered] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handleComplete = () => {
    onComplete({ difficulty, triggerBothered, notes });
  };

  const handleSkip = () => {
    onSkipAll();
  };

  const handleNext = () => {
    if (step === 3) {
      handleComplete();
    } else {
      setStep((step + 1) as 1 | 2 | 3);
    }
  };

  const hasAnswerForCurrentStep =
    (step === 1 && difficulty !== null) ||
    (step === 2 && triggerBothered !== null) ||
    step === 3;

  const headingStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 400,
    color: '#1a1a1a',
    marginTop: 48,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100svh',
        padding: '24px 28px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Progress dots */}
      <div className="progress-dots" style={{ marginTop: 16 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`progress-dot${step === i ? ' active' : ''}`}
          />
        ))}
      </div>

      {/* Content area */}
      <div style={{ flex: 1 }}>
        {step === 1 && (
          <>
            <div style={headingStyle}>How difficult was this session?</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 12,
                marginTop: 32,
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const selected = difficulty === n;
                return (
                  <div
                    key={n}
                    onClick={() => setDifficulty(n)}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      border: '1.5px solid #2d2d2d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      background: selected ? '#2d2d2d' : 'transparent',
                      color: selected ? '#ffffff' : '#2d2d2d',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {n}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={headingStyle}>Did the trigger sound bother you?</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginTop: 32,
              }}
            >
              {triggerOptions.map((opt) => {
                const selected = triggerBothered === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => setTriggerBothered(opt.value)}
                    style={{
                      border: '1.5px solid #2d2d2d',
                      borderRadius: 12,
                      padding: '16px 20px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      background: selected ? '#2d2d2d' : 'transparent',
                      color: selected ? '#ffffff' : '#1a1a1a',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={headingStyle}>Anything else you'd like to note?</div>
            <textarea
              placeholder="Optional notes about this session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                border: '1.5px solid #d4cdc4',
                borderRadius: 12,
                padding: 16,
                fontSize: '0.95rem',
                background: 'transparent',
                width: '100%',
                height: 120,
                resize: 'none',
                marginTop: 32,
                fontFamily: 'var(--font-family)',
                color: '#1a1a1a',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2d2d2d';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d4cdc4';
              }}
            />
          </>
        )}
      </div>

      {/* Bottom navigation */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 24,
        }}
      >
        <span
          style={{
            fontSize: '0.9rem',
            color: '#999',
            cursor: 'pointer',
          }}
          onClick={handleSkip}
        >
          Skip
        </span>
        <span
          style={{
            fontSize: '0.9rem',
            color: hasAnswerForCurrentStep ? '#2d2d2d' : '#6b6b6b',
            cursor: 'pointer',
            fontWeight: hasAnswerForCurrentStep ? 500 : 400,
          }}
          onClick={handleNext}
        >
          {step === 3 ? 'Done' : 'Next'}
        </span>
      </div>
    </div>
  );
};

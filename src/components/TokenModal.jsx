import { useState } from 'react';

const PACKS = [
  { id: 'starter', name: 'Starter', tokens: 10, price: 9, pricePerToken: '0.90' },
  { id: 'builder', name: 'Builder', tokens: 25, price: 19, pricePerToken: '0.76', best: true },
  { id: 'studio', name: 'Studio', tokens: 50, price: 35, pricePerToken: '0.70' },
];

export default function TokenModal({ onClose, currentBalance = 0 }) {
  const [selected, setSelected] = useState('builder');
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState('');

  const handleNotify = () => {
    if (email) {
      console.log('Token purchase interest:', { email, pack: selected });
      setNotified(true);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#2A1545',
        border: '1px solid rgba(212,165,90,0.3)',
        borderRadius: '16px',
        padding: '36px',
        maxWidth: '480px',
        width: '100%',
        position: 'relative'
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', color: '#F5E6C8',
          fontSize: '20px', cursor: 'pointer', opacity: 0.6
        }}>✕</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🪙</div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: '#D4A55A', fontSize: '26px', margin: '0 0 8px'
          }}>Get More Tokens</h2>
          <p style={{ color: '#F5E6C8', opacity: 0.7, fontSize: '14px', margin: 0 }}>
            Your balance: <strong style={{ color: '#D4A55A' }}>{currentBalance} tokens</strong>
          </p>
        </div>

        {/* Packs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {PACKS.map(pack => (
            <div
              key={pack.id}
              onClick={() => setSelected(pack.id)}
              style={{
                border: selected === pack.id
                  ? '2px solid #D4A55A'
                  : '1px solid rgba(212,165,90,0.2)',
                borderRadius: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
                background: selected === pack.id
                  ? 'rgba(212,165,90,0.08)'
                  : 'rgba(255,255,255,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {pack.best && (
                <span style={{
                  position: 'absolute', top: '-10px', left: '16px',
                  background: '#D4A55A', color: '#1C0F2E',
                  fontSize: '10px', fontWeight: '700',
                  padding: '2px 8px', borderRadius: '20px',
                  letterSpacing: '0.05em'
                }}>BEST VALUE</span>
              )}
              <div>
                <div style={{
                  color: '#F5E6C8', fontWeight: '600', fontSize: '15px'
                }}>{pack.name}</div>
                <div style={{
                  color: '#D4A55A', fontSize: '13px', opacity: 0.8
                }}>${pack.pricePerToken} per token</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  color: '#D4A55A', fontSize: '20px', fontWeight: '700'
                }}>{pack.tokens} tokens</div>
                <div style={{
                  color: '#F5E6C8', opacity: 0.6, fontSize: '13px'
                }}>${pack.price}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Token costs reference */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(212,165,90,0.1)',
          borderRadius: '10px',
          padding: '14px 16px',
          marginBottom: '24px',
          fontSize: '13px',
          color: '#F5E6C8',
          opacity: 0.8
        }}>
          <div style={{ marginBottom: '6px', opacity: 1, fontWeight: '600', color: '#D4A55A' }}>
            Token costs
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 16px' }}>
            <span>Full assessment</span><span style={{ color: '#D4A55A' }}>3 tokens</span>
            <span>Advisor follow-up</span><span style={{ color: '#D4A55A' }}>1 token</span>
            <span>Actionable gameplan</span><span style={{ color: '#D4A55A' }}>2 tokens</span>
            <span>Idea comparison</span><span style={{ color: '#D4A55A' }}>3 tokens</span>
          </div>
        </div>

        {/* CTA */}
        {!notified ? (
          <div>
            <p style={{
              color: '#F5E6C8', opacity: 0.6, fontSize: '13px',
              textAlign: 'center', marginBottom: '12px'
            }}>
              Purchasing coming soon — enter your email to be notified first.
            </p>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(212,165,90,0.25)',
                borderRadius: '8px', color: '#F5E6C8',
                fontSize: '14px', marginBottom: '10px',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={handleNotify}
              style={{
                width: '100%', padding: '14px',
                background: '#D4A55A', color: '#1C0F2E',
                border: 'none', borderRadius: '8px',
                fontSize: '15px', fontWeight: '700',
                cursor: 'pointer', letterSpacing: '0.02em'
              }}
            >
              Notify me when tokens are available
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>✨</div>
            <p style={{ color: '#D4A55A', fontWeight: '600', margin: '0 0 4px' }}>
              You're on the list!
            </p>
            <p style={{ color: '#F5E6C8', opacity: 0.6, fontSize: '13px', margin: 0 }}>
              We'll let you know the moment token purchases go live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

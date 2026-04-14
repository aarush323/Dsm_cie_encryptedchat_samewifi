import { useState } from 'react';

function KeyPanel({ keys, onGenerate }) {
  const [showPrivate, setShowPrivate] = useState(false);

  const formatKey = (key) => {
    if (!key) return 'Not generated';
    return `${key.e?.toString().slice(0, 20)}... (e), n = ${key.n?.toString().slice(0, 30)}...`;
  };

  const formatFullKey = (key) => {
    if (!key) return '';
    return `e: ${key.e}\nn: ${key.n}`;
  };

  const formatPrivateKey = (key) => {
    if (!key) return '';
    return `d: ${key.d}\nn: ${key.n}`;
  };

  return (
    <div className="key-panel">
      <h3>RSA Keys</h3>
      
      {!keys ? (
        <button className="generate-btn" onClick={onGenerate}>
          Generate Keys
        </button>
      ) : (
        <>
          <div className="key-section">
            <div className="key-header">
              <span>Public Key</span>
              <span className="key-badge">Shared</span>
            </div>
            <code className="key-value">{formatKey(keys.publicKey)}</code>
          </div>

          <div className="key-section">
            <div className="key-header">
              <span>Private Key</span>
              <button 
                className="reveal-btn"
                onClick={() => setShowPrivate(!showPrivate)}
              >
                {showPrivate ? 'Hide' : 'Reveal'}
              </button>
            </div>
            {showPrivate ? (
              <code className="key-value private">{formatPrivateKey(keys.privateKey)}</code>
            ) : (
              <div className="key-hidden">
                <span>••••••••••••••••</span>
                <small>Click reveal to view</small>
              </div>
            )}
          </div>

          <button className="regenerate-btn" onClick={onGenerate}>
            Regenerate Keys
          </button>
        </>
      )}

      <style>{`
        .key-panel {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 1rem;
        }
        
        .key-panel h3 {
          color: #888;
          font-size: 0.85rem;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        
        .generate-btn, .regenerate-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #00d4ff, #00ff88);
          color: #1a1a2e;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .generate-btn:hover, .regenerate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
        }
        
        .key-section {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        
        .key-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          color: #888;
        }
        
        .key-badge {
          background: rgba(0, 255, 136, 0.2);
          color: #00ff88;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
        }
        
        .key-value {
          display: block;
          font-size: 0.75rem;
          color: #00d4ff;
          word-break: break-all;
          line-height: 1.4;
        }
        
        .key-value.private {
          color: #ff6b6b;
        }
        
        .key-hidden {
          text-align: center;
          padding: 0.5rem;
          color: #666;
        }
        
        .key-hidden small {
          display: block;
          font-size: 0.7rem;
          margin-top: 0.25rem;
        }
        
        .reveal-btn {
          padding: 0.25rem 0.5rem;
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
          border: none;
          border-radius: 4px;
          font-size: 0.7rem;
          cursor: pointer;
        }
        
        .reveal-btn:hover {
          background: rgba(255, 107, 107, 0.3);
        }
      `}</style>
    </div>
  );
}

export default KeyPanel;

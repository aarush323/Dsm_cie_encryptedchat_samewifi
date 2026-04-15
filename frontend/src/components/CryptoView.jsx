function CryptoView({ steps, onClose }) {
  if (!steps) return null;

  return (
    <div className="crypto-modal-overlay" onClick={onClose}>
      <div className="crypto-modal" onClick={e => e.stopPropagation()}>
        <div className="crypto-modal-header">
          <h2>RSA Encryption</h2>
          <button className="crypto-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="crypto-modal-body">
          <div className="crypto-step">
            <div className="step-num">1</div>
            <div className="step-info">
              <div className="step-label">Original</div>
              <div className="step-val">"{steps.original}"</div>
            </div>
          </div>

          <div className="crypto-arrow">↓</div>

          <div className="crypto-step">
            <div className="step-num">2</div>
            <div className="step-info">
              <div className="step-label">ASCII</div>
              <div className="step-val ascii">[{steps.ascii.map(n => String(n)).join(', ')}]</div>
            </div>
          </div>

          <div className="crypto-arrow">↓</div>

          <div className="crypto-step">
            <div className="step-num">3</div>
            <div className="step-info">
              <div className="step-label">RSA Encrypt</div>
              <div className="step-formula">c = m<sup>e</sup> mod n</div>
            </div>
          </div>

          <div className="crypto-arrow">↓</div>

          <div className="crypto-step highlight">
            <div className="step-num">4</div>
            <div className="step-info">
              <div className="step-label">Encrypted (Network)</div>
              <div className="step-val encrypted">
                {steps.encrypted.slice(0, 4).map(n => n.toString()).join(', ')}
                {steps.encrypted.length > 4 && '...'}
              </div>
            </div>
          </div>

          <div className="crypto-divider">Decryption</div>

          <div className="crypto-step">
            <div className="step-num">5</div>
            <div className="step-info">
              <div className="step-label">RSA Decrypt</div>
              <div className="step-formula">m = c<sup>d</sup> mod n</div>
            </div>
          </div>

          <div className="crypto-arrow">↓</div>

          <div className="crypto-step">
            <div className="step-num">6</div>
            <div className="step-info">
              <div className="step-label">Decrypted</div>
              <div className="step-val success">"{steps.original}"</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .crypto-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .crypto-modal {
          background: #0d1420;
          border: 1px solid rgba(0, 212, 255, 0.25);
          border-radius: 16px;
          width: 100%;
          max-width: 420px;
          max-height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 212, 255, 0.1);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .crypto-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(0, 212, 255, 0.15);
          background: rgba(0, 0, 0, 0.2);
        }
        .crypto-modal-header h2 {
          color: #00d4ff;
          font-size: 1rem;
          margin: 0;
          font-weight: 600;
        }
        .crypto-close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 1.3rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .crypto-close-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .crypto-modal-body {
          padding: 1.25rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .crypto-step {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .step-num {
          width: 24px;
          height: 24px;
          min-width: 24px;
          background: rgba(0, 212, 255, 0.15);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #00d4ff;
        }
        .step-info {
          flex: 1;
        }
        .step-label {
          font-size: 0.7rem;
          color: #666;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
        }
        .step-val {
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-size: 0.85rem;
          word-break: break-all;
          color: #00ff88;
        }
        .step-val.ascii {
          color: #ffdd00;
          font-family: monospace;
          font-size: 0.75rem;
        }
        .step-val.encrypted {
          color: #ff6b6b;
          font-family: monospace;
          font-size: 0.7rem;
        }
        .step-val.success {
          color: #00ff88;
        }
        .step-formula {
          padding: 0.5rem 0.75rem;
          background: rgba(0, 212, 255, 0.08);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.9rem;
          color: #fff;
        }
        .crypto-arrow {
          color: #00d4ff;
          font-size: 1.1rem;
          padding: 0.1rem 0;
        }
        .crypto-step.highlight {
          background: rgba(255, 107, 107, 0.08);
          border: 1px solid rgba(255, 107, 107, 0.2);
          border-radius: 8px;
          padding: 0.75rem;
          margin: 0.25rem 0;
        }
        .crypto-divider {
          width: 100%;
          text-align: center;
          color: #444;
          font-size: 0.7rem;
          padding: 0.5rem 0;
          margin: 0.25rem 0;
          border-top: 1px dashed rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 480px) {
          .crypto-modal {
            max-height: 90vh;
          }
          .crypto-modal-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CryptoView;
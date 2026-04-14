function CryptoView({ steps }) {
  if (!steps) return null;

  return (
    <div className="crypto-view">
      <h3>RSA Encryption Process</h3>
      <div className="steps">
        <div className="step">
          <div className="step-label">1. Original Message</div>
          <div className="step-value original">"{steps.original}"</div>
        </div>

        <div className="arrow">↓</div>

        <div className="step">
          <div className="step-label">2. ASCII Conversion</div>
          <div className="step-value ascii">
            [{steps.ascii.map(n => String(n)).join(', ')}]
          </div>
        </div>

        <div className="arrow">↓</div>

        <div className="step">
          <div className="step-label">3. RSA Encryption</div>
          <div className="step-value formula">
            c = m<sup>e</sup> mod n
          </div>
          <div className="step-value small">
            e = {steps.publicKey.e}
          </div>
        </div>

        <div className="arrow">↓</div>

        <div className="step">
          <div className="step-label">4. Encrypted Ciphertext</div>
          <div className="step-value encrypted">
            {steps.encrypted.slice(0, 3).map(n => n.toString()).join(', ')}
            {steps.encrypted.length > 3 && '...'}
          </div>
          <div className="step-note">
            This is what travels over the network
          </div>
        </div>

        <div className="divider">— Recipient Decryption —</div>

        <div className="step">
          <div className="step-label">5. RSA Decryption</div>
          <div className="step-value formula">
            m = c<sup>d</sup> mod n
          </div>
        </div>

        <div className="arrow">↓</div>

        <div className="step">
          <div className="step-label">6. ASCII → Text</div>
          <div className="step-value original">"{steps.original}"</div>
        </div>
      </div>

      <style>{`
        .crypto-view {
          background: rgba(0, 0, 0, 0.22);
          border-top: 1px solid rgba(0, 212, 255, 0.22);
          padding: 1rem;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .crypto-view h3 {
          color: var(--accent, #00d4ff);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .steps {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .step {
          width: 100%;
          text-align: center;
        }
        
        .step-label {
          font-size: 0.75rem;
          color: var(--muted, #888);
          margin-bottom: 0.25rem;
        }
        
        .step-value {
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 6px;
          font-size: 0.85rem;
          word-break: break-all;
        }
        
        .step-value.original {
          color: var(--accent2, #00ff88);
        }
        
        .step-value.ascii {
          color: #ffdd00;
        }
        
        .step-value.formula {
          color: #fff;
          font-family: monospace;
        }
        
        .step-value.encrypted {
          color: var(--danger, #ff6b6b);
          font-size: 0.75rem;
        }
        
        .step-value.small {
          color: var(--muted, #888);
          font-size: 0.7rem;
          margin-top: 0.25rem;
        }
        
        .step-note {
          font-size: 0.65rem;
          color: var(--danger, #ff6b6b);
          margin-top: 0.25rem;
          font-style: italic;
        }
        
        .arrow {
          color: var(--accent, #00d4ff);
          font-size: 1.2rem;
        }
        
        .divider {
          color: var(--muted2, #666);
          font-size: 0.75rem;
          margin: 0.75rem 0;
          padding: 0.25rem 1rem;
          border: 1px dashed rgba(255, 255, 255, 0.22);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default CryptoView;

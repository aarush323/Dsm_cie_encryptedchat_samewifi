function AttackerView({ messages }) {
  return (
    <div className="attacker-view">
      <h3>
        <span className="icon">🔴</span>
        Attacker View
      </h3>
      <p className="description">
        What an interceptor would see
      </p>

      <div className="intercepted-section">
        {messages.length === 0 ? (
          <div className="empty">
            No messages intercepted yet
          </div>
        ) : (
          <div className="message-list">
            {messages.map((msg, i) => (
              <div key={i} className="intercepted-message">
                <div className="from">From: {msg.from}</div>
                <div className="cipher-label">Encrypted payload:</div>
                <code className="cipher-data">
                  {msg.raw.slice(0, 2).map(n => n.toString()).join(', ')}
                  {msg.raw.length > 2 && '...'}
                </code>
                <div className="time">{msg.time}</div>
                <div className="decrypt-status">
                  Cannot decrypt without private key
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="explanation">
        <h4>Why RSA is Secure</h4>
        <ul>
          <li>Factorization of large numbers is computationally hard</li>
          <li>Attacker sees only ciphertext</li>
          <li>Private key is never transmitted</li>
        </ul>
      </div>

      <style>{`
        .attacker-view {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .attacker-view h3 {
          color: #ff6b6b;
          font-size: 1rem;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .icon {
          font-size: 1.2rem;
        }
        
        .description {
          color: #888;
          font-size: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .intercepted-section {
          flex: 1;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .empty {
          color: #666;
          text-align: center;
          font-size: 0.85rem;
          padding: 1rem;
        }
        
        .message-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .intercepted-message {
          padding: 0.75rem;
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 100, 100, 0.3);
          border-radius: 6px;
        }
        
        .from {
          font-size: 0.8rem;
          color: #ff8888;
          margin-bottom: 0.5rem;
        }
        
        .cipher-label {
          font-size: 0.7rem;
          color: #888;
          margin-bottom: 0.25rem;
        }
        
        .cipher-data {
          display: block;
          font-size: 0.7rem;
          color: #ff6b6b;
          word-break: break-all;
          margin-bottom: 0.5rem;
        }
        
        .time {
          font-size: 0.65rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
        
        .decrypt-status {
          font-size: 0.7rem;
          color: #ff4444;
          font-style: italic;
        }
        
        .explanation {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 0.75rem;
        }
        
        .explanation h4 {
          color: #888;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }
        
        .explanation ul {
          margin: 0;
          padding-left: 1rem;
          font-size: 0.75rem;
          color: #666;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}

export default AttackerView;

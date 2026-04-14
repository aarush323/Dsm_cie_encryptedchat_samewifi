import { useEffect, useRef } from 'react';

function AttackerView({ messages }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="attacker-view">
      <div className="attacker-header">
        <div className="recording-dot"></div>
        <h3>Attacker View</h3>
      </div>
      <p className="description">
        Live Packet Interception - Sniffing WebSocket Traffic...
      </p>

      <div className="intercepted-section" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="empty">
            <span className="blinking-cursor">_</span> Waiting for packets...
          </div>
        ) : (
          <div className="message-list">
            {messages.map((msg, i) => (
              <div key={i} className="intercepted-message">
                <div className="packet-header">
                  <span className="from">SOURCE: {msg.from}</span>
                  <span className="time">{msg.time}</span>
                </div>
                
                <div className="cipher-label">ENCRYPTED PAYLOAD DETECTED:</div>
                <code className="cipher-data">
                  {msg.raw.length > 50 
                    ? msg.raw.slice(0, 50).join(', ') + '...'
                    : msg.raw.join(', ')}
                </code>
                
                <div className="decrypt-status">
                  [!] ACCESS DENIED: Cannot decrypt without target's private key
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="explanation">
        <h4>SECURITY ANALYSIS</h4>
        <ul>
          <li><strong>Encryption:</strong> RSA Asymmetric</li>
          <li><strong>Vulnerability:</strong> None detected. Factorization of large primes is computationally infeasible.</li>
          <li><strong>Status:</strong> Attacker sees only ciphertext. Private key never transmitted over network.</li>
        </ul>
      </div>

      <style>{`
        .attacker-view {
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: 'Courier New', Courier, monospace;
        }
        
        .attacker-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        
        .recording-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #ff3333;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 51, 51, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(255, 51, 51, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 51, 51, 0); }
        }

        .attacker-view h3 {
          color: #ff3333;
          font-size: 1.1rem;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .description {
          color: #ff6b6b;
          font-size: 0.75rem;
          margin-bottom: 1rem;
          border-bottom: 1px dashed #ff3333;
          padding-bottom: 0.5rem;
        }
        
        .intercepted-section {
          flex: 1;
          overflow-y: auto;
          background: #050505;
          border: 1px solid #331111;
          border-radius: 4px;
          padding: 0.75rem;
          margin-bottom: 1rem;
          box-shadow: inset 0 0 15px rgba(255, 0, 0, 0.05);
        }
        
        .empty {
          color: #ff3333;
          text-align: left;
          font-size: 0.85rem;
          padding: 1rem;
          opacity: 0.8;
        }

        .blinking-cursor {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }
        
        .message-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .intercepted-message {
          padding: 0.75rem;
          background: rgba(20, 0, 0, 0.8);
          border-left: 3px solid #ff3333;
          border-right: 1px solid #331111;
          border-top: 1px solid #331111;
          border-bottom: 1px solid #331111;
          border-radius: 0 4px 4px 0;
        }
        
        .packet-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #441111;
          padding-bottom: 0.3rem;
          margin-bottom: 0.5rem;
        }

        .from {
          font-size: 0.75rem;
          color: #ffaaaa;
          font-weight: bold;
        }
        
        .time {
          font-size: 0.65rem;
          color: #ff6666;
        }

        .cipher-label {
          font-size: 0.7rem;
          color: #ff8888;
          margin-bottom: 0.25rem;
        }
        
        .cipher-data {
          display: block;
          font-size: 0.7rem;
          color: #ff3333;
          word-break: break-all;
          margin-bottom: 0.5rem;
          background: #0a0000;
          padding: 0.5rem;
          border: 1px dashed #551111;
        }
        
        .decrypt-status {
          font-size: 0.7rem;
          color: #ff0000;
          font-weight: bold;
          text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
          margin-top: 0.5rem;
        }
        
        .explanation {
          background: #0a0505;
          border: 1px solid #ff3333;
          border-radius: 4px;
          padding: 0.75rem;
          border-left: 4px solid #ff3333;
        }
        
        .explanation h4 {
          color: #ffaaaa;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
          margin-top: 0;
          text-transform: uppercase;
        }
        
        .explanation ul {
          margin: 0;
          padding-left: 1rem;
          font-size: 0.7rem;
          color: #ff8888;
          line-height: 1.5;
        }
        
        .explanation li {
          margin-bottom: 0.25rem;
        }
        
        .explanation li strong {
          color: #ffaaaa;
        }
      `}</style>
    </div>
  );
}

export default AttackerView;

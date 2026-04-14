import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = `http://${window.location.hostname}:8000`;

function ServerLogs() {
  const [logs, setLogs] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    // connect to socket without registering
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      setLogs(prev => [...prev, { level: 'INFO', log: '>> Connected to backend log stream...', timestamp: new Date().toLocaleTimeString() }]);
    });

    socket.on('server_log', (data) => {
      setLogs(prev => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (level) => {
    switch(level) {
      case 'ACTION': return '#00ff88';
      case 'ERROR': return '#ff6b6b';
      case 'EVENT': return '#00d4ff';
      case 'KEY': return '#ffd700';
      default: return '#aaaaaa';
    }
  };

  return (
    <div className="server-logs-container">
      <div className="server-logs-header">
        <h2>Server Backend Logs</h2>
        <span className="live-badge">● LIVE INTERCEPTION</span>
      </div>
      <div className="logs-terminal">
        {logs.map((log, i) => (
          <div key={i} className="log-line">
             <span style={{ color: getColor(log.level) }}>{log.log}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <style>{`
        .server-logs-container {
          height: 100vh;
          background: #0a0e14;
          display: flex;
          flex-direction: column;
          color: #00ff00;
          font-family: 'Courier New', Courier, monospace;
          padding: 1rem;
        }

        .server-logs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid #333;
          margin-bottom: 1rem;
        }

        .server-logs-header h2 {
          color: #ffffff;
          margin: 0;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-size: 1.2rem;
        }

        .live-badge {
          color: #ff3333;
          font-weight: bold;
          animation: blink 1s infinite alternate;
        }

        @keyframes blink {
          from { opacity: 1; }
          to { opacity: 0.3; }
        }

        .logs-terminal {
          flex: 1;
          overflow-y: auto;
          background: #000;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #333;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
        }

        .log-line {
          margin-bottom: 0.4rem;
          font-size: 0.9rem;
          line-height: 1.4;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
}

export default ServerLogs;

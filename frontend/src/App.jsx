import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { generateKeys, generatePrime, textToNumbers, numbersToText, encrypt, decrypt } from './utils/rsa';
import Chat from './components/Chat';
import KeyPanel from './components/KeyPanel';
import CryptoView from './components/CryptoView';
import AttackerView from './components/AttackerView';

const SERVER_URL = `http://${window.location.hostname}:8000`;

function App() {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [keys, setKeys] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showCryptoView, setShowCryptoView] = useState(false);
  const [cryptoSteps, setCryptoSteps] = useState(null);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [attackerMessages, setAttackerMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAttackerPanel, setShowAttackerPanel] = useState(true);
  const [recipientKeys, setRecipientKeys] = useState({});

  const socketRef = useRef(null);
  const keysRef = useRef(null);
  const recipientRef = useRef('');
  const usernameRef = useRef('');
  const recipientKeysRef = useRef({});

  useEffect(() => {
    recipientKeysRef.current = recipientKeys;
  }, [recipientKeys]);

  useEffect(() => {
    keysRef.current = keys;
  }, [keys]);

  useEffect(() => {
    recipientRef.current = selectedRecipient;
  }, [selectedRecipient]);

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  const handleConnect = () => {
    if (!inputUsername.trim()) return;
    setUsername(inputUsername.trim());
  };

  const generateNewKeys = () => {
    const p = generatePrime(50);
    const q = generatePrime(50);
    const newKeys = generateKeys(p, q);
    setKeys(newKeys);
    keysRef.current = newKeys;

    if (socketRef.current && usernameRef.current) {
      const pubKeyToSend = {
        e: newKeys.publicKey.e.toString(),
        n: newKeys.publicKey.n.toString()
      };
      socketRef.current.emit('share_public_key', { 
        userId: usernameRef.current, 
        publicKey: pubKeyToSend 
      });
    }
  };

  useEffect(() => {
    if (!username) return;

    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('register', { userId: username });
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('users_list', ({ users }) => {
      setOnlineUsers(users.filter(u => u !== username));
    });

    socket.on('user_joined', ({ userId }) => {
      if (userId !== username) {
        setOnlineUsers(prev => [...new Set([...prev, userId])]);
      }
    });

    socket.on('user_left', ({ userId }) => {
      setOnlineUsers(prev => prev.filter(u => u !== userId));
      if (recipientRef.current === userId) {
        setSelectedRecipient('');
      }
    });

    socket.on('receive_message', (data) => {
      console.log('receive_message event fired!', data);
      const { from, message } = data;
      const currentKeys = keysRef.current;

      setAttackerMessages(prev => [...prev, {
        from,
        raw: message,
        time: new Date().toLocaleTimeString()
      }]);

      if (!currentKeys) {
        console.log('No keys on receiving device - showing encrypted');
        setMessages(prev => [...prev, { 
          from, 
          text: '[Encrypted - Generate keys to decrypt]', 
          type: 'received',
          raw: message 
        }]);
        return;
      }

      if (message) {
        try {
          const cipherAsBigInt = message.map(n => BigInt(n));
          const decrypted = decrypt(cipherAsBigInt, currentKeys.privateKey);
          const text = numbersToText(decrypted);
          console.log('Decrypted message:', text);
          setMessages(prev => [...prev, { from, text, type: 'received', raw: message }]);
        } catch (err) {
          console.log('Decryption error:', err);
          setMessages(prev => [...prev, { from, text: '[Decryption failed]', type: 'received' }]);
        }
      }
    });

    socket.on('public_key_update', ({ userId, publicKey }) => {
      const parsedKey = { e: BigInt(publicKey.e), n: BigInt(publicKey.n) };
      setRecipientKeys(prev => ({ ...prev, [userId]: parsedKey }));
    });

    socket.on('all_public_keys', (keysDict) => {
      const parsed = {};
      for (const [uid, pub] of Object.entries(keysDict)) {
        parsed[uid] = { e: BigInt(pub.e), n: BigInt(pub.n) };
      }
      setRecipientKeys(parsed);
    });

    socket.emit('request_public_keys', {});
    socket.emit('request_users', {});

    return () => {
      socket.disconnect();
    };
  }, [username]);

  const sendMessage = (text) => {
    const socket = socketRef.current;
    const currentKeys = keysRef.current;
    const recipient = recipientRef.current;
    const user = usernameRef.current;

    if (!socket || !recipient || !currentKeys) return;

    const recipientKey = recipientKeysRef.current[recipient];
    if (!recipientKey) {
      alert(`Cannot send: ${recipient} hasn't generated their keys yet!`);
      return;
    }

    const asciiArray = textToNumbers(text);
    const encrypted = encrypt(asciiArray, recipientKey);

    setCryptoSteps({
      original: text,
      ascii: asciiArray,
      encrypted: encrypted,
      publicKey: recipientKey,
      timestamp: new Date().toLocaleTimeString()
    });
    setShowCryptoModal(true);

    socket.emit('send_message', {
      to: recipient,
      from: user,
      message: encrypted.map(n => n.toString()),
      type: 'encrypted',
      timestamp: new Date().toISOString()
    });

    setMessages(prev => [...prev, { from: 'You', text, type: 'sent' }]);
  };

  if (!username) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>SecureChat</h1>
          <p className="subtitle">RSA-Encrypted Real-Time Messaging</p>
          <input
            type="text"
            placeholder="Enter your username..."
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
          />
          <button onClick={handleConnect}>Connect</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>SecureChat</h1>
          <div className="header-actions">
            <button
              type="button"
              className="icon-btn only-mobile"
              aria-pressed={showSidebar}
              onClick={() => setShowSidebar(v => !v)}
              title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
            >
              Users
            </button>
            <button
              type="button"
              className="icon-btn only-mobile"
              aria-pressed={showAttackerPanel}
              onClick={() => setShowAttackerPanel(v => !v)}
              title={showAttackerPanel ? 'Hide attacker view' : 'Show attacker view'}
            >
              Attacker
            </button>
          </div>
        </div>
        <div className="status">
          <span className={`status-dot ${connected ? 'online' : 'offline'}`}></span>
          {username} {connected ? 'Online' : 'Offline'}
        </div>
      </header>

      <div className="main-content">
        <aside className={`sidebar ${showSidebar ? '' : 'is-collapsed'}`}>
          <KeyPanel keys={keys} onGenerate={generateNewKeys} />

          <div className="users-section">
            <h3>Online Users</h3>
            {onlineUsers.length === 0 ? (
              <p className="no-users">No other users online</p>
            ) : (
              <ul className="user-list">
                {onlineUsers.map(user => (
                  <li
                    key={user}
                    className={selectedRecipient === user ? 'selected' : ''}
                    onClick={() => setSelectedRecipient(user)}
                  >
                    {user}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <main className="chat-area">
          <Chat
            messages={messages}
            onSend={sendMessage}
            selectedRecipient={selectedRecipient}
          />
        </main>

        {showCryptoModal && cryptoSteps && (
          <CryptoView steps={cryptoSteps} onClose={() => setShowCryptoModal(false)} />
        )}

        <aside className={`attacker-panel ${showAttackerPanel ? '' : 'is-collapsed'}`}>
          <AttackerView messages={attackerMessages} />
        </aside>
      </div>
    </div>
  );
}

export default App;

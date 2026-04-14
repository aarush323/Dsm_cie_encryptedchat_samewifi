import { useState } from 'react';

function Chat({ messages, onSend, selectedRecipient }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedRecipient) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="chat">
      <div className="chat-header">
        {selectedRecipient ? (
          <span>Chatting with <strong>{selectedRecipient}</strong></span>
        ) : (
          <span className="no-select">Select a user to start chatting</span>
        )}
      </div>

      <div className="messages">
        {messages.length === 0 && (
          <div className="empty-chat">
            {selectedRecipient 
              ? 'Start the conversation! Your message will be encrypted with RSA.'
              : 'Select an online user from the sidebar to start messaging.'}
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.type}`}>
            <div className="message-bubble">
              <span className="message-text">{msg.text}</span>
              <span className="message-meta">
                {msg.type === 'sent' ? 'You' : msg.from}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form className="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedRecipient ? 'Type a message...' : 'Select a user first...'}
          disabled={!selectedRecipient}
        />
        <button type="submit" disabled={!selectedRecipient || !input.trim()}>
          Send
        </button>
      </form>

      <style>{`
        .chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .chat-header {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.95rem;
        }
        
        .chat-header strong {
          color: #00d4ff;
        }
        
        .no-select {
          color: #666;
        }
        
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .empty-chat {
          text-align: center;
          color: #666;
          margin-top: 3rem;
          font-size: 0.95rem;
        }
        
        .message {
          display: flex;
        }
        
        .message.sent {
          justify-content: flex-end;
        }
        
        .message.received {
          justify-content: flex-start;
        }
        
        .message-bubble {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          position: relative;
        }
        
        .message.sent .message-bubble {
          background: rgba(0, 212, 255, 0.3);
        }
        
        .message-text {
          display: block;
          word-break: break-word;
        }
        
        .message-meta {
          display: block;
          font-size: 0.7rem;
          color: #888;
          margin-top: 0.25rem;
        }
        
        .input-area {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .input-area input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.3);
          color: #fff;
          font-size: 1rem;
          outline: none;
        }
        
        .input-area input:focus {
          border-color: #00d4ff;
        }
        
        .input-area input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .input-area button {
          padding: 0.75rem 1.5rem;
          background: #00d4ff;
          color: #1a1a2e;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .input-area button:hover:not(:disabled) {
          background: #00b8e6;
        }
        
        .input-area button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default Chat;

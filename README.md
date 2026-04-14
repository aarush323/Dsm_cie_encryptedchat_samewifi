# SecureChat - RSA Encrypted Messaging Demo

## System Overview

A demonstration of real-time encrypted messaging using RSA cryptography. Messages are encrypted in the browser before transmission - the backend server only relays ciphertext.

```
[Device A] ←→ [Backend Server] ←→ [Device B]
  (RSA)          (Relay Only)         (RSA)
```

---

## Setup

### 1. Start Backend Server

```bash
cd securechat/backend
pip install -r requirements.txt
uvicorn main:socket_app --host 0.0.0.0 --port 8000
```

### 2. Configure Frontend Connection

Edit `frontend/src/App.jsx` line 10:
```javascript
const SERVER_URL = 'http://YOUR_IP:8000';
```

To find your IP: `ip a` (look for 192.168.x.x)

### 3. Start Frontend

```bash
cd securechat/frontend
npm install
npm run dev
```

---

## Demo Walkthrough

### Step 1: Device Connection
- Open the frontend URL on both devices
- Enter usernames (e.g., "Alice", "Bob")
- Both users appear in each other's online user list

### Step 2: Key Generation
- Click "Generate Keys" on each device
- Public key is shown (safe to share)
- Private key is hidden by default

### Step 3: Send Message
- Select recipient from sidebar
- Type message and click "Send"
- Toggle "Show Crypto Steps" to view the encryption process

### Step 4: Observe
- **Crypto Steps Panel**: Shows text → ASCII → encrypted ciphertext
- **Attacker View Panel**: Shows what interceptors see (unreadable)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect | Check backend is running; verify firewall |
| User not found | Refresh page; ensure unique usernames |
| Messages not appearing | Select recipient in sidebar |

---

## Technical Details

- **Algorithm**: RSA with 50-digit primes (~166 bits)
- **Crypto Location**: Browser-only (JavaScript implementation)
- **Network Data**: Only ciphertext transmitted
- **Key Exchange**: Public keys shared freely, private keys kept local

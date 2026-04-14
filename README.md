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
cd backend
pip install -r requirements.txt
uvicorn main:socket_app --host 0.0.0.0 --port 8000
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

(The frontend is configured to dynamically connect to the backend relative to your network IP!)

---

## Features & Demo Walkthrough

### 1. Multi-Device Secure Chat 
- Open the frontend URL (e.g., `http://localhost:5173`) on both devices
- Enter **unique** usernames (e.g., "Alice", "Bob")
- Generate RSA Keys
- Messages are fully encrypted before sending!

### 2. Cyber Attack Simulation Panel
- The app features an **Attacker View Panel** on the right side.
- This panel demonstrates what a malicious interceptor (man-in-the-middle attack) would see.
- Live sniffing simulates capturing encrypted payloads with visual indicators representing the math-heavy factorizations of RSA algorithms.

### 3. Dedicated Server Logs Monitor
- SecureChat includes a separate internal dashboard for viewing backend Socket.io logs.
- Go to `http://localhost:5173/server` in a secondary browser window.
- This dedicated Live Interception screen monitors all connections, disconnections, key exchanges, and message relays dynamically!

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect | Check backend is running; verify firewall |
| User not found | Enter **UNIQUE usernames** across windows, otherwise you can't view each other. |
| Messages not appearing | Select the recipient from the left sidebar before typing! |

---

## Technical Details

- **Algorithm**: RSA with 50-digit primes (~166 bits)
- **Crypto Location**: Browser-only (JavaScript implementation)
- **Network Data**: Only ciphertext transmitted
- **Key Exchange**: Public keys shared freely, private keys hidden in memory

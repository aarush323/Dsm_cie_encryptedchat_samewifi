import socketio
from fastapi import FastAPI
from datetime import datetime

sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
app = FastAPI()
socket_app = socketio.ASGIApp(sio, app)

users = {}
public_keys = {}

async def broadcast_log(level: str, message: str):
    timestamp = datetime.now().strftime("%H:%M:%S")
    log_entry = f"[{timestamp}] [{level}] {message}"
    print(log_entry)
    await sio.emit("server_log", {"log": log_entry, "level": level, "timestamp": timestamp})

@sio.event
async def connect(sid, environ):
    await broadcast_log("INFO", f"Connected: {sid}")

@sio.event
async def disconnect(sid):
    await broadcast_log("INFO", f"Disconnected: {sid}")
    for user_id, s in list(users.items()):
        if s == sid:
            del users[user_id]
            if user_id in public_keys:
                del public_keys[user_id]
            await sio.emit("user_left", {"userId": user_id})
            await broadcast_log("INFO", f"User disconnected: {user_id}")
            break

@sio.event
async def register(sid, data):
    user_id = data.get("userId")
    users[user_id] = sid
    await broadcast_log("INFO", f"User registered: {user_id} -> {sid}")
    await sio.emit("user_joined", {"userId": user_id})
    await sio.emit("users_list", {"users": list(users.keys())}, to=sid)

@sio.event
async def send_message(sid, data):
    receiver = data.get("to")
    sender = data.get("from")
    message = data.get("message")

    await broadcast_log("EVENT", f"Message from {sender} to {receiver} (length: {len(message)} digits)")
    
    if receiver in users:
        await broadcast_log("ACTION", f"Relaying encrypted payload to {receiver}")
        await sio.emit(
            "receive_message",
            {
                "from": sender,
                "message": message,
                "type": "encrypted",
                "timestamp": data.get("timestamp"),
            },
            to=users[receiver],
        )
    else:
        await broadcast_log("ERROR", f"User {receiver} not found")
        await sio.emit("send_failed", {"error": "User not found"}, to=sid)

@sio.event
async def request_users(sid, data):
    await sio.emit("users_list", {"users": list(users.keys())}, to=sid)

@sio.event
async def share_public_key(sid, data):
    user_id = data.get("userId")
    pub_key = data.get("publicKey")
    public_keys[user_id] = pub_key
    await broadcast_log("KEY", f"Public key registered for: {user_id}")
    await sio.emit("public_key_update", {"userId": user_id, "publicKey": pub_key})

@sio.event
async def request_public_keys(sid, data):
    await sio.emit("all_public_keys", public_keys, to=sid)

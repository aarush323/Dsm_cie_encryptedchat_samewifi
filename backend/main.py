import socketio
from fastapi import FastAPI

sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
app = FastAPI()
socket_app = socketio.ASGIApp(sio, app)

users = {}


@sio.event
async def connect(sid, environ):
    print(f"[+] Connected: {sid}")


@sio.event
async def disconnect(sid):
    print(f"[-] Disconnected: {sid}")
    for user_id, s in list(users.items()):
        if s == sid:
            del users[user_id]
            await sio.emit("user_left", {"userId": user_id})
            break


@sio.event
async def register(sid, data):
    user_id = data.get("userId")
    users[user_id] = sid
    print(f"[*] User registered: {user_id} -> {sid}")
    await sio.emit("user_joined", {"userId": user_id})
    await sio.emit("users_list", {"users": list(users.keys())}, to=sid)


@sio.event
async def send_message(sid, data):
    receiver = data.get("to")
    sender = data.get("from")
    message = data.get("message")

    print(f"[*] send_message event received from sid={sid}")
    print(f"[*] Sender: {sender}, Receiver: {receiver}")
    print(f"[*] All registered users: {list(users.keys())}")
    print(f"[*] Receiver in users? {receiver in users}")

    if receiver in users:
        print(f"[*] Relaying message to {receiver} (sid={users[receiver]})")
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
        print(f"[*] Message relayed successfully")
    else:
        print(f"[*] User not found, sending error to {sid}")
        await sio.emit("send_failed", {"error": "User not found"}, to=sid)


@sio.event
async def request_users(sid, data):
    await sio.emit("users_list", {"users": list(users.keys())}, to=sid)

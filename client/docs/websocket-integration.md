# Client-Server WebSocket Integration

## Overview

Đây là tài liệu mô tả việc tích hợp WebSocket giữa client React và server Node.js cho game 3D multiplayer.

## Cấu hình

### Environment Variables (.env.local)

```env
# Server Configuration
REACT_APP_SERVER_URL=ws://localhost:8080
REACT_APP_API_URL=http://localhost:8080/api

# Game Configuration
REACT_APP_GAME_MODE=development
REACT_APP_DEBUG_MODE=true
REACT_APP_SHOW_FPS=true

# Graphics Settings
REACT_APP_GRAPHICS_QUALITY=high
REACT_APP_PARTICLE_COUNT=2000
REACT_APP_SHADOWS=true

# Audio Settings
REACT_APP_AUDIO_ENABLED=true
REACT_APP_MASTER_VOLUME=80

# Analytics & Monitoring (Development)
REACT_APP_ANALYTICS_ENABLED=false
REACT_APP_ERROR_REPORTING=false

# Feature Flags
REACT_APP_ENABLE_MULTIPLAYER=true
REACT_APP_ENABLE_AI_FISH=true
REACT_APP_ENABLE_MONETIZATION=false
```

## Kiến trúc Client-Side

### 1. SocketClient (client/src/network/SocketClient.ts)

`SocketClient` là wrapper đơn giản hóa cho `NetworkManager`, cung cấp interface rõ ràng cho việc giao tiếp WebSocket:

**Chức năng chính:**
- Kết nối tự động đến server URL từ environment variables
- Lắng nghe `GAME_STATE_UPDATE` messages từ server
- Gửi input commands (aim, fire, join) đến server
- Quản lý trạng thái kết nối và ping

**Sử dụng:**
```typescript
const socketClient = SocketClient.getInstance();
await socketClient.connect();
socketClient.sendJoin('PlayerName');
```

### 2. NetworkManager (client/src/network/NetworkManager.ts)

`NetworkManager` là class chính xử lý tất cả giao tiếp WebSocket:

**Chức năng:**
- Socket.io client implementation
- Message handling cho tất cả game message types
- Auto-reconnection và heartbeat system
- Integration với GameStore để cập nhật game state

### 3. BabylonEngine Integration

BabylonEngine được tích hợp với SocketClient để gửi input đến server:

```typescript
// Mouse movement -> Aim
this.scene.onPointerObservable.add((pointerInfo) => {
  if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
    const screenX = pointerInfo.event.clientX;
    const screenY = pointerInfo.event.clientY;
    const cameraMatrix = this.camera.getWorldMatrix().asArray();
    socketClient.sendAim(screenX, screenY, cameraMatrix);
  }
});

// Mouse click -> Fire
case BABYLON.PointerEventTypes.POINTERDOWN:
  socketClient.sendFire(1); // weaponId = 1
```

## Message Flow

### 1. Client -> Server

- **PLAYER_JOIN**: Gửi khi player vào game
- **PLAYER_AIM**: Gửi liên tục khi di chuyển chuột (mouse tracking)  
- **PLAYER_FIRE**: Gửi khi click chuột (shooting)

### 2. Server -> Client  

- **GAME_STATE_UPDATE**: Nhận từ server mỗi tick (20Hz)
  - Cập nhật entity positions
  - Player states
  - Game world state
- **ENTITY_SPAWN**: Khi có fish/projectile mới spawn
- **ENTITY_DESTROY**: Khi fish bị tiêu diệt
- **REWARD_GRANTED**: Khi player nhận coins/items

## Game State Synchronization

### NetworkManager handles GAME_STATE_UPDATE:

```typescript
private handleGameStateUpdate(message: GameStateUpdateMessage): void {
  const { updatePlayerState, entities, addEntity, updateEntity } = useGameStore.getState();
  
  // Update entities
  message.entities.forEach(entity => {
    if (entities.has(entity.id)) {
      updateEntity(entity.id, entity);
    } else {
      addEntity(entity);
    }
  });
  
  // Update player states
  message.playerStates.forEach(playerState => {
    if (playerState.id === 'local-player') {
      updatePlayerState(playerState);
    }
  });
}
```

## Connection Status Display

GameHUD hiển thị trạng thái kết nối real-time:

- 🟢 **CONNECTED**: Kết nối thành công, hiển thị ping
- 🔴 **DISCONNECTED**: Mất kết nối hoặc chưa kết nối

## Components Integration

### App.tsx
- Quản lý game states: loading, menu, connecting, playing, paused
- Khởi tạo SocketClient connection
- Handle connection errors

### GameCanvas.tsx  
- Render Babylon.js scene
- Initialize BabylonEngine với input handling

### GameHUD.tsx
- Hiển thị connection status và ping
- Player stats (health, score, currency)
- Control hints

## Error Handling

### Connection Errors
- Auto-retry với exponential backoff
- Fallback về menu nếu connection fail
- User notification cho connection issues

### Message Errors
- Timeout handling (5 seconds default)
- Invalid message format handling
- Server error message display

## Performance Optimizations

### Client-side Prediction
- Placeholder for future client prediction system
- Position reconciliation với server authoritative state

### Message Throttling
- Mouse aim messages có thể được throttled
- Heartbeat system để maintain connection

### Network Optimization
- Binary message protocol support (future)
- Message compression (future)
- Batch message sending (future)

## Development Testing

### Connection Testing
```bash
# Start server first
cd server && npm run dev

# Start client
cd client && npm run dev

# Check browser console for connection logs
```

### Debug Features
- Connection info in GameHUD
- Console logging for all network events
- Environment variable debugging

## Future Enhancements

1. **Client-side Prediction**: Smooth player movement
2. **Server Reconciliation**: Resolve prediction conflicts  
3. **Message Compression**: Reduce bandwidth usage
4. **Connection Recovery**: Seamless reconnection
5. **Lag Compensation**: Accommodate high-latency players

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check server is running on port 8080
   - Verify REACT_APP_SERVER_URL in .env.local

2. **CORS Errors**
   - Server should handle CORS for localhost:3000
   - Check server CORS configuration

3. **Messages Not Received**
   - Check NetworkManager event handlers
   - Verify message type constants match between client/server

4. **High Ping/Lag**
   - Check network conditions
   - Monitor server performance
   - Consider message throttling

## Kết luận

Client hiện tại đã được tích hợp hoàn toàn với server WebSocket:
- Kết nối tự động từ environment variables
- Input handling và gửi đến server
- Nhận và xử lý game state updates
- Connection status monitoring
- Error handling và reconnection logic

Server authoritative game loop (20Hz) sẽ gửi game state updates xuống client, và client sẽ render 3D scene dựa trên data này.
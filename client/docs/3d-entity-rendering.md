# 3D Entity Rendering System

## Overview

Hệ thống render 3D entities kết nối dữ liệu game từ server với visual 3D rendering trong Babylon.js. System này bao gồm:

1. **BabylonEngine Entity Management**: 3D mesh creation và animation
2. **EntityRenderer**: Bridge giữa GameStore và BabylonEngine  
3. **GameStore Integration**: State management cho entities
4. **NetworkManager Integration**: Sync entities từ server

## Kiến trúc

### 1. Data Flow

```
Server (GameStateUpdate) → NetworkManager → GameStore → EntityRenderer → BabylonEngine → 3D Scene
```

### 2. Core Components

#### BabylonEngine Entity System
```typescript
// Entity management trong BabylonEngine
public createEntity(entity: GameEntity): void
public updateEntity(entity: GameEntity): void  
public removeEntity(entityId: string): void
public clearAllEntities(): void
```

#### EntityRenderer Bridge
```typescript
// Bridge component kết nối GameStore với BabylonEngine
export const useEntityRenderer = () => {
  // Sync logic between GameStore entities and 3D rendering
}
```

#### GameStore Entity Management
```typescript
// Zustand store cho entity state
addEntity(entity: GameEntity): void
updateEntity(entityId: string, updates: Partial<GameEntity>): void
removeEntity(entityId: string): void
```

## Entity Types & 3D Rendering

### 1. Fish Entities

#### Visual Design:
- **Small Fish**: Yellow spherical, size 0.8, schooling behavior
- **Medium Fish**: Light blue spherical, size 1.2, group swimming  
- **Large Fish**: Orange spherical, size 2.0, individual movement
- **Boss Fish**: Red spherical, size 3.5, special effects

#### Features:
- **Health bars**: Dynamic green/yellow/red bars above fish
- **AI State visual feedback**: Color changes based on AI behavior
  - Normal: No glow
  - Fleeing: Red tint
  - Attacking: Red glow
  - Dying: White flash

```typescript
// Fish creation in BabylonEngine
private createFishMesh(entity: GameEntity): BABYLON.AbstractMesh {
  // Size and color based on fish type
  // Health bar creation
  // Material management per fish type
}
```

### 2. Projectiles

#### Visual Design:
- **Yellow glowing spheres** (diameter 0.3)
- **Trail effects** - simple box trail behind projectile
- **Movement**: Based on velocity vector from server

#### Features:
- Emissive material for glow effect
- Parent-child relationship với trail effect
- Automatic disposal when lifetime expires

### 3. Loot Items

#### Visual Design:
- **Coins**: Gold colored spheres with gold glow
- **Items**: Purple colored spheres with purple glow
- **Floating animation**: Up/down movement + rotation

#### Features:
- Continuous floating animation
- Rotation animation
- Emissive materials for attraction effect

## Animation Systems

### 1. Fish Movement
- Position updates from server `GAME_STATE_UPDATE`
- Smooth interpolation between positions (future enhancement)
- Rotation based on movement direction

### 2. Projectile Physics  
- Velocity-based movement
- Trail effect following projectile
- Collision detection preparation

### 3. Loot Animations
```typescript
private addFloatingAnimation(mesh: BABYLON.AbstractMesh): void {
  // Y-axis floating animation (0.5 unit amplitude)
  // Y-axis rotation animation (360 degrees, 2 second cycle)
}
```

## Performance Optimizations

### 1. Material Reuse
```typescript
// Materials are cached per entity type
private fishMaterials: Map<EntityType, BABYLON.Material> = new Map();
```

### 2. Mesh Pooling (Future)
- Object pooling cho frequently spawned entities
- Reduce garbage collection pressure

### 3. LOD System (Future)  
- Level-of-detail based on camera distance
- Lower poly meshes for distant entities

## Synchronization

### 1. Server → Client Sync
- 20Hz `GAME_STATE_UPDATE` từ server
- Real-time entity position/rotation updates
- Health changes reflected in health bars

### 2. Entity Lifecycle
```typescript
// Entity spawn flow
Server sends ENTITY_SPAWN → NetworkManager → GameStore.addEntity() → EntityRenderer detects → BabylonEngine.createEntity()

// Entity update flow  
Server sends GAME_STATE_UPDATE → NetworkManager updates GameStore → EntityRenderer syncs → BabylonEngine.updateEntity()

// Entity removal flow
Server sends ENTITY_DESTROY → NetworkManager → GameStore.removeEntity() → EntityRenderer detects → BabylonEngine.removeEntity()
```

### 3. Sync Rate
- **Entity Sync**: 20 FPS (every 50ms) - matches GameStore update detection
- **3D Rendering**: 60 FPS (Babylon.js render loop)
- **Network**: 20Hz server updates

## Development Tools

### 1. Test Entities
```typescript
// Browser console commands
EntityTestUtil.spawnTestEntities(); // Create test fish/projectiles/loot
EntityTestUtil.startEntityAnimation(); // Animate test entities
EntityTestUtil.clearTestEntities(); // Clean up test entities
```

### 2. Debug Information
- **F1 Key**: Spawn test entities (development mode)
- **HUD Debug Panel**: Shows FPS, entity count, particle count
- **Console Logging**: Entity creation/update/removal events

### 3. Environment Variables
```env
REACT_APP_DEBUG_MODE=true  # Enable debug features
REACT_APP_SHOW_FPS=true   # Show FPS counter
```

## Visual Features

### 1. Underwater Environment
- Directional lighting simulating sun rays
- Water-like material properties
- Sand ground texture
- Coral decorations

### 2. Entity Visual Feedback
- **Health indication**: Color-coded health bars
- **AI state feedback**: Emissive color changes
- **Weapon damage**: Visual hit effects (future)
- **Death effects**: Flash animations

### 3. UI Integration
- **Entity count** in HUD debug panel
- **Performance metrics** (FPS, particle count)
- **Connection status** affecting entity sync

## Error Handling

### 1. Missing Assets
- Fallback materials when textures fail to load
- Console warnings for debugging
- Graceful degradation

### 2. Entity Sync Issues  
- Cleanup orphaned 3D meshes
- Validation of entity data before rendering
- Recovery from rendering errors

### 3. Performance Issues
- Automatic entity count monitoring
- Performance warnings in development mode
- Disposal of unused resources

## Future Enhancements

### 1. Advanced Graphics
- **Realistic fish models**: GLTF/GLB fish models thay vì spheres
- **Water shader effects**: Caustic lighting, bubbles
- **Particle systems**: Blood effects, explosion particles
- **Dynamic lighting**: Shadows, underwater light rays

### 2. Animation Improvements  
- **Smooth interpolation**: Client-side prediction cho smooth movement
- **Fish schooling visual**: Boids-based swimming animations
- **Weapon effects**: Muzzle flash, impact effects

### 3. Performance Scaling
- **Instance rendering**: Efficient rendering cho large fish schools
- **Culling system**: Don't render off-screen entities
- **Mesh compression**: Optimized models and textures

### 4. Audio Integration
- **3D positional audio**: Sounds based on entity positions
- **Underwater sound effects**: Bubbles, splashes, weapon sounds
- **Dynamic music**: Intensity based on game events

## Files

- `/client/src/engine/BabylonEngine.ts` - Core 3D rendering và entity management
- `/client/src/engine/EntityRenderer.tsx` - Bridge component
- `/client/src/gameplay/GameStore.ts` - Entity state management  
- `/client/src/network/NetworkManager.ts` - Server sync
- `/client/src/utils/entityTestUtil.ts` - Development testing tools
- `/client/src/components/GameHUD.tsx` - Debug information display

## Summary

3D Entity Rendering System hoàn toàn functional:
- ✅ **Real-time 3D rendering** của game entities từ server
- ✅ **Smooth synchronization** giữa network và 3D scene
- ✅ **Visual feedback** cho health, AI states, animations
- ✅ **Development tools** cho testing và debugging
- ✅ **Performance monitoring** và optimization ready
- ✅ **Extensible architecture** cho future enhancements

Game giờ có khả năng render đầy đủ underwater world với fish, projectiles, và loot items trong 3D environment!
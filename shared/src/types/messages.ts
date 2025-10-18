// Game Message Protocol Types
export enum MessageType {
  // Client -> Server
  PLAYER_AIM = 0x01,
  PLAYER_FIRE = 0x02,
  PLAYER_MOVE_TOWER = 0x03,
  PLAYER_JOIN = 0x04,
  PLAYER_LEAVE = 0x05,
  PLAYER_UPGRADE = 0x06,
  
  // Server -> Client  
  GAME_STATE_UPDATE = 0x10,
  ENTITY_SPAWN = 0x11,
  ENTITY_DESTROY = 0x12,
  ENTITY_UPDATE = 0x13,
  
  // Rewards & Economy
  REWARD_GRANTED = 0x20,
  CURRENCY_UPDATE = 0x21,
  ITEM_GRANTED = 0x22,
  
  // System Messages
  ERROR = 0xFF,
  HEARTBEAT = 0xFE
}

// Base Message Interface
export interface BaseMessage {
  type: MessageType;
  timestamp: number;
  playerId?: string;
}

// Client -> Server Messages
export interface PlayerAimMessage extends BaseMessage {
  type: MessageType.PLAYER_AIM;
  screenX: number;
  screenY: number;
  cameraMatrix?: number[]; // 4x4 matrix for ray calculation
}

export interface PlayerFireMessage extends BaseMessage {
  type: MessageType.PLAYER_FIRE;
  weaponId: number;
  power?: number; // 0-1 for charge weapons
}

export interface PlayerMoveTowerMessage extends BaseMessage {
  type: MessageType.PLAYER_MOVE_TOWER;
  targetX: number;
  targetY: number;
}

export interface PlayerJoinMessage extends BaseMessage {
  type: MessageType.PLAYER_JOIN;
  username: string;
  sessionToken?: string;
}

// Server -> Client Messages
export interface GameStateUpdateMessage extends BaseMessage {
  type: MessageType.GAME_STATE_UPDATE;
  tick: number;
  entities: GameEntity[];
  playerStates: PlayerState[];
}

export interface EntitySpawnMessage extends BaseMessage {
  type: MessageType.ENTITY_SPAWN;
  entity: GameEntity;
}

export interface EntityDestroyMessage extends BaseMessage {
  type: MessageType.ENTITY_DESTROY;
  entityId: string;
  reason?: string;
}

// Reward Messages
export interface RewardGrantedMessage extends BaseMessage {
  type: MessageType.REWARD_GRANTED;
  currency: number;
  items?: ItemGrant[];
  source: 'kill' | 'achievement' | 'ad_reward' | 'purchase';
}

// Union type for all messages
export type GameMessage = 
  | PlayerAimMessage
  | PlayerFireMessage 
  | PlayerMoveTowerMessage
  | PlayerJoinMessage
  | GameStateUpdateMessage
  | EntitySpawnMessage
  | EntityDestroyMessage
  | RewardGrantedMessage;

// Game Entity Types
export enum EntityType {
  PLAYER_TOWER = 'tower',
  FISH_SMALL = 'fish_small',
  FISH_MEDIUM = 'fish_medium', 
  FISH_LARGE = 'fish_large',
  FISH_BOSS = 'fish_boss',
  PROJECTILE = 'projectile',
  LOOT_COIN = 'loot_coin',
  LOOT_ITEM = 'loot_item',
  PARTICLE_EFFECT = 'particle',
  ENVIRONMENTAL = 'environment'
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface GameEntity {
  id: string;
  type: EntityType;
  position: Vector3;
  rotation: Vector3;
  velocity?: Vector3;
  scale?: Vector3;
  size?: number;
  
  // Gameplay properties
  health?: number;
  maxHealth?: number;
  damage?: number;
  value?: number; // for loot/fish
  weaponId?: number; // for projectiles
  lastDamagedBy?: string; // killer tracking
  stateChangeTime?: number;
  deathTime?: number;
  specialAbilities?: string[];
  targetId?: string;
  
  // Visual properties
  modelUrl?: string;
  textureUrl?: string;
  animationState?: string;
  
  // Physics
  collisionRadius?: number;
  mass?: number;
  
  // AI specific (for fish)
  aiState?: any;
  targetPosition?: Vector3;
  
  // Projectile specific
  lifetime?: number;
  ownerId?: string;
  
  // Timestamps
  createdAt: number;
  lastUpdate: number;
}

export enum AIState {
  IDLE = 'idle',
  WANDERING = 'wandering', 
  FLEEING = 'fleeing',
  SCHOOLING = 'schooling',
  ATTACKING = 'attacking', // for boss fish
  DYING = 'dying'
}

export interface PlayerState {
  id: string;
  username: string;
  position: Vector3;
  rotation: Vector3;
  
  // Stats
  score: number;
  currency: number;
  health: number;
  experience?: number;
  
  // Equipment
  weaponId: number;
  weaponLevel: number;
  weaponCooldowns?: Record<number, number>;
  damageMultiplier?: number;
  
  // Status
  isActive: boolean;
  lastActivity: number;
  
  // Progression and inventory (optional)
  achievements?: string[];
  statistics?: {
    kills?: number;
    hits?: number;
    criticalHits?: number;
    shotsFired?: number;
  };
  inventory?: Record<number, number>;
  // Backward-compat alias
  coins?: number;
}

export interface ItemGrant {
  itemId: number;
  quantity: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

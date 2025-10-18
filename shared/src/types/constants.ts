// Game Constants
export const GAME_CONFIG = {
  // Server Settings
  TICK_RATE: 20, // Hz (50ms per tick)
  MAX_PLAYERS: 4,
  
  // World Dimensions (Babylon.js units)
  WORLD_SIZE: {
    width: 100,
    height: 50,
    depth: 100
  },
  
  // Physics
  GRAVITY: -9.81,
  WATER_DENSITY: 1000, // kg/m³
  PROJECTILE_SPEED: 25, // units/second
  PROJECTILE_LIFETIME: 5000, // milliseconds
  
  // Collision Detection
  COLLISION_LAYERS: {
    PROJECTILE: 1,
    FISH: 2,
    ENVIRONMENT: 4,
    PLAYER: 8
  },
  
  // AI Settings
  AI_UPDATE_INTERVAL: 100, // ms
  BOIDS_SETTINGS: {
    separationRadius: 3,
    alignmentRadius: 5,
    cohesionRadius: 7,
    maxSpeed: 8,
    maxForce: 0.5
  },
  
  // Economy
  CURRENCY: {
    STARTING_COINS: 1000,
    COIN_VALUE_RANGE: [10, 100], // min, max coins per fish
    UPGRADE_COSTS: [100, 250, 500, 1000, 2000]
  }
} as const;

// Weapon Configurations
export const WEAPONS = {
  1: {
    id: 1,
    name: 'Basic Net Gun',
    damage: 10,
    fireRate: 1.0, // shots per second
    projectileSpeed: 20,
    cost: 0, // starting weapon
    description: 'Standard fishing weapon'
  },
  2: {
    id: 2,
    name: 'Power Harpoon',
    damage: 25,
    fireRate: 0.5,
    projectileSpeed: 30,
    cost: 500,
    description: 'High damage, slow reload'
  },
  3: {
    id: 3,
    name: 'Rapid Shooter', 
    damage: 8,
    fireRate: 3.0,
    projectileSpeed: 25,
    cost: 750,
    description: 'Fast firing rate'
  },
  4: {
    id: 4,
    name: 'Electric Net',
    damage: 15,
    fireRate: 1.2,
    projectileSpeed: 22,
    cost: 1200,
    specialEffect: 'chain_damage',
    description: 'Damages multiple nearby fish'
  }
} as const;

// Fish Types Configuration
export const FISH_TYPES = {
  small_fish: {
    health: 20,
    speed: 6,
    value: [10, 30],
    size: 0.5,
    aiType: 'boids',
    spawnWeight: 60 // higher = more common
  },
  medium_fish: {
    health: 50,
    speed: 4,
    value: [40, 80],
    size: 1.0,
    aiType: 'boids',
    spawnWeight: 30
  },
  large_fish: {
    health: 120,
    speed: 3,
    value: [100, 200],
    size: 1.8,
    aiType: 'boids',
    spawnWeight: 8
  },
  boss_fish: {
    health: 500,
    speed: 2,
    value: [500, 1000],
    size: 3.0,
    aiType: 'astar',
    spawnWeight: 2,
    specialAbilities: ['charge_attack', 'spawn_minions']
  }
} as const;

// Loot Tables
export const LOOT_TABLES = {
  small_fish: [
    { type: 'coins', weight: 80, amount: [5, 15] },
    { type: 'item', weight: 15, itemId: 1 }, // basic bait
    { type: 'item', weight: 5, itemId: 2 }  // rare bait
  ],
  medium_fish: [
    { type: 'coins', weight: 70, amount: [20, 40] },
    { type: 'item', weight: 20, itemId: 2 },
    { type: 'item', weight: 8, itemId: 3 },  // weapon upgrade
    { type: 'item', weight: 2, itemId: 10 } // rare gem
  ],
  large_fish: [
    { type: 'coins', weight: 60, amount: [50, 100] },
    { type: 'item', weight: 25, itemId: 3 },
    { type: 'item', weight: 10, itemId: 4 },
    { type: 'item', weight: 5, itemId: 11 } // epic gem
  ],
  boss_fish: [
    { type: 'coins', weight: 50, amount: [200, 500] },
    { type: 'item', weight: 30, itemId: 5 }, // guaranteed weapon upgrade
    { type: 'item', weight: 15, itemId: 12 }, // legendary gem  
    { type: 'item', weight: 5, itemId: 20 }   // mythic item
  ]
} as const;

// UI Constants
export const UI_CONFIG = {
  HEALTH_BAR_COLOR: '#ff4444',
  CURRENCY_COLOR: '#ffd700',
  EXPERIENCE_COLOR: '#00ff88',
  
  // Animation durations (ms)
  TRANSITION_DURATION: 300,
  DAMAGE_TEXT_DURATION: 2000,
  COIN_COLLECT_DURATION: 800,
  
  // Z-Index layers
  Z_INDEX: {
    GAME_CANVAS: 1,
    HUD: 10,
    MODAL: 100,
    TOOLTIP: 1000
  }
} as const;

// Network Configuration
export const NETWORK_CONFIG = {
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 2000, // ms
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
  MESSAGE_TIMEOUT: 5000,
  
  // Client-side prediction
  PREDICTION_BUFFER: 3, // ticks
  RECONCILIATION_THRESHOLD: 0.1 // position difference threshold
} as const;

// Asset Paths
export const ASSET_PATHS = {
  MODELS: {
    FISH_SMALL: '/assets/models/fish/small_fish.glb',
    FISH_MEDIUM: '/assets/models/fish/medium_fish.glb', 
    FISH_LARGE: '/assets/models/fish/large_fish.glb',
    FISH_BOSS: '/assets/models/fish/boss_fish.glb',
    PROJECTILE: '/assets/models/weapons/projectile.glb'
  },
  
  TEXTURES: {
    WATER: '/assets/textures/water/seamless_ocean_water_underwater_texture_blue_ripples.jpg',
    SAND: '/assets/textures/sand/seamless_underwater_ocean_floor_sand_texture.jpg',
    CORAL: '/assets/textures/coral/vibrant_underwater_coral_reef_texture.jpg',
    SKYBOX: '/assets/skybox/underwater_caustic_light_rays_skybox_texture.jpg'
  },
  
  EFFECTS: {
    BUBBLES: '/assets/effects/particles/underwater_bubbles_particle_effect_sprite.png',
    EXPLOSION: '/assets/effects/explosions/underwater_explosion_bubbles_impact_effect_turquoise_water.jpg',
    TRAILS: '/assets/effects/trails/underwater_bullet_trail_projectile_effect_game_realism.jpg'
  },
  
  UI: {
    BUTTONS: '/assets/ui/buttons/underwater_ocean_theme_game_ui_buttons_interface_kit.jpg',
    ICONS: '/assets/ui/icons/',
    CURRENCY: '/assets/ui/icons/game_currency_gems_reward_icons_set.jpg'
  }
} as const;
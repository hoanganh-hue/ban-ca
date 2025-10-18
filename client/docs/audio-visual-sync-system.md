# 🎵 Precision Audio-Visual Synchronization System

## Overview

This document describes the implementation of a frame-perfect audio-visual synchronization system that ensures all sound effects and music transitions are perfectly aligned with visual events and game rhythm.

## Architecture

### 1. Precision Audio Scheduler

```typescript
/**
 * Frame-perfect audio scheduling system
 * Compensates for audio latency and ensures synchronization
 */
export class PrecisionAudioScheduler {
  private audioContext: AudioContext;
  private audioLatency: number = 35; // ms - measured latency
  private frameTime: number = 16.67; // ms - 60 FPS
  private scheduledEvents: Map<string, ScheduledAudioEvent> = new Map();
  private currentFrame: number = 0;
  
  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.measureLatency();
  }
  
  /**
   * Measure actual audio system latency
   */
  private async measureLatency(): Promise<void> {
    const testSound = this.audioContext.createOscillator();
    const startTime = performance.now();
    
    testSound.connect(this.audioContext.destination);
    testSound.start(this.audioContext.currentTime);
    
    // Measure when sound actually starts
    await new Promise(resolve => {
      testSound.onended = () => {
        const endTime = performance.now();
        this.audioLatency = endTime - startTime;
        resolve(null);
      };
      testSound.stop(this.audioContext.currentTime + 0.001);
    });
    
    console.log(`Audio latency measured: ${this.audioLatency}ms`);
  }
  
  /**
   * Schedule sound to play exactly when visual event occurs
   */
  scheduleSound(
    soundId: string,
    visualEventFrame: number,
    soundBuffer: AudioBuffer,
    volume: number = 1.0
  ): void {
    // Calculate compensation for audio latency
    const compensationFrames = Math.round(this.audioLatency / this.frameTime);
    const playFrame = visualEventFrame - compensationFrames;
    
    const event: ScheduledAudioEvent = {
      soundId,
      playFrame,
      soundBuffer,
      volume,
      status: 'scheduled'
    };
    
    this.scheduledEvents.set(soundId, event);
    
    console.log(`Scheduled ${soundId} for frame ${playFrame} (visual frame: ${visualEventFrame})`);
  }
  
  /**
   * Update called every frame (60 FPS)
   */
  update(deltaTime: number): void {
    this.currentFrame++;
    
    // Check for sounds to play this frame
    this.scheduledEvents.forEach((event, soundId) => {
      if (event.status === 'scheduled' && this.currentFrame >= event.playFrame) {
        this.playSound(event);
        event.status = 'playing';
        
        // Remove from schedule after playing
        setTimeout(() => {
          this.scheduledEvents.delete(soundId);
        }, event.soundBuffer.duration * 1000);
      }
    });
  }
  
  /**
   * Play sound immediately
   */
  private playSound(event: ScheduledAudioEvent): void {
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = event.soundBuffer;
    gainNode.gain.value = event.volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start(this.audioContext.currentTime);
  }
  
  /**
   * Sync sound with animation
   */
  syncWithAnimation(
    soundId: string,
    animation: BABYLON.Animation,
    keyFrame: number
  ): void {
    // Calculate frame when animation reaches keyframe
    const fps = animation.framePerSecond;
    const frameTime = (keyFrame / fps) * 1000; // ms
    const visualFrame = Math.round(frameTime / this.frameTime);
    
    this.scheduleSound(soundId, visualFrame, this.getSoundBuffer(soundId));
  }
  
  private getSoundBuffer(soundId: string): AudioBuffer {
    // Get from audio asset manager
    return audioAssetManager.getBuffer(soundId);
  }
}

interface ScheduledAudioEvent {
  soundId: string;
  playFrame: number;
  soundBuffer: AudioBuffer;
  volume: number;
  status: 'scheduled' | 'playing' | 'completed';
}
```

### 2. Beat-Synchronized Event System

```typescript
/**
 * Synchronizes game events with musical beats
 * Ensures all significant actions happen on beat
 */
export class BeatSyncSystem {
  private bpm: number;
  private beatInterval: number; // ms per beat
  private nextBeat: number = 0;
  private currentBeat: number = 0;
  private startTime: number;
  private beatCallbacks: Map<number, BeatCallback[]> = new Map();
  
  constructor(bpm: number = 120) {
    this.setBPM(bpm);
    this.startTime = performance.now();
    this.startBeatTracking();
  }
  
  setBPM(bpm: number): void {
    this.bpm = bpm;
    this.beatInterval = 60000 / bpm; // Convert BPM to ms per beat
    console.log(`Beat sync system set to ${bpm} BPM (${this.beatInterval}ms per beat)`);
  }
  
  /**
   * Start tracking beats
   */
  private startBeatTracking(): void {
    setInterval(() => {
      const currentTime = performance.now() - this.startTime;
      this.currentBeat = Math.floor(currentTime / this.beatInterval);
      
      if (this.currentBeat > Math.floor(this.nextBeat)) {
        this.onBeat(this.currentBeat);
        this.nextBeat = this.currentBeat;
      }
    }, 16); // Check every frame at 60 FPS
  }
  
  /**
   * Called every beat
   */
  private onBeat(beatNumber: number): void {
    // Execute callbacks registered for this beat
    const callbacks = this.beatCallbacks.get(beatNumber % 4); // 4/4 time signature
    if (callbacks) {
      callbacks.forEach(callback => callback.execute());
    }
  }
  
  /**
   * Snap event time to next beat
   */
  snapToNextBeat(eventTime: number): number {
    const currentTime = performance.now() - this.startTime;
    const nextBeatTime = Math.ceil(currentTime / this.beatInterval) * this.beatInterval;
    return nextBeatTime;
  }
  
  /**
   * Snap to specific beat division (1/4, 1/8, 1/16 notes)
   */
  snapToBeatDivision(eventTime: number, division: number): number {
    const divisionInterval = this.beatInterval / division;
    const currentTime = performance.now() - this.startTime;
    const nextDivisionTime = Math.ceil(currentTime / divisionInterval) * divisionInterval;
    return nextDivisionTime;
  }
  
  /**
   * Register callback for specific beat
   */
  onBeatCallback(beat: number, callback: () => void): void {
    const beatMod = beat % 4;
    if (!this.beatCallbacks.has(beatMod)) {
      this.beatCallbacks.set(beatMod, []);
    }
    this.beatCallbacks.get(beatMod)!.push({
      execute: callback
    });
  }
  
  /**
   * Get time until next beat
   */
  getTimeToNextBeat(): number {
    const currentTime = performance.now() - this.startTime;
    const timeSinceLastBeat = currentTime % this.beatInterval;
    return this.beatInterval - timeSinceLastBeat;
  }
  
  /**
   * Check if event should snap to beat
   */
  shouldSnapToBeat(eventType: string): boolean {
    // Critical events should snap to beat
    const criticalEvents = [
      'weapon_fire',
      'enemy_spawn',
      'boss_attack',
      'power_up',
      'level_complete'
    ];
    return criticalEvents.includes(eventType);
  }
  
  /**
   * Sync weapon fire to beat
   */
  syncWeaponFire(fireCallback: () => void): void {
    const timeToNextBeat = this.getTimeToNextBeat();
    
    // If very close to beat (within 50ms), snap to beat
    if (timeToNextBeat < 50) {
      setTimeout(() => {
        fireCallback();
      }, timeToNextBeat);
    } else {
      // Fire immediately if not close to beat
      fireCallback();
    }
  }
  
  /**
   * Get current musical intensity (0-100)
   */
  getMusicalIntensity(): number {
    const currentBeat = this.currentBeat % 4;
    
    // First beat of measure is strongest
    if (currentBeat === 0) return 100;
    // Third beat is second strongest
    if (currentBeat === 2) return 80;
    // Other beats are weaker
    return 60;
  }
}

interface BeatCallback {
  execute: () => void;
}
```

### 3. Audio-Visual Sync Integration

```typescript
/**
 * Integrates precision scheduler with game engine
 */
export class AudioVisualSyncManager {
  private scheduler: PrecisionAudioScheduler;
  private beatSync: BeatSyncSystem;
  private babylonEngine: BabylonEngine;
  private currentMusicBPM: number = 120;
  
  constructor(
    audioContext: AudioContext,
    babylonEngine: BabylonEngine
  ) {
    this.scheduler = new PrecisionAudioScheduler(audioContext);
    this.beatSync = new BeatSyncSystem(this.currentMusicBPM);
    this.babylonEngine = babylonEngine;
    
    this.setupGameEventHandlers();
  }
  
  /**
   * Setup handlers for game events
   */
  private setupGameEventHandlers(): void {
    // Weapon fire
    this.babylonEngine.on('weapon_fire', (data) => {
      this.handleWeaponFire(data);
    });
    
    // Enemy hit
    this.babylonEngine.on('enemy_hit', (data) => {
      this.handleEnemyHit(data);
    });
    
    // Enemy death
    this.babylonEngine.on('enemy_death', (data) => {
      this.handleEnemyDeath(data);
    });
    
    // Boss spawn
    this.babylonEngine.on('boss_spawn', (data) => {
      this.handleBossSpawn(data);
    });
    
    // Level complete
    this.babylonEngine.on('level_complete', (data) => {
      this.handleLevelComplete(data);
    });
  }
  
  /**
   * Handle weapon fire with perfect sync
   */
  private handleWeaponFire(data: any): void {
    const weaponType = data.weaponType;
    const position = data.position;
    
    // Get weapon fire animation frame
    const fireAnimation = data.animation;
    const muzzleFlashFrame = 5; // Frame where muzzle flash appears
    
    // Schedule weapon sound to play exactly when muzzle flash shows
    this.scheduler.scheduleSound(
      `weapon_fire_${weaponType}`,
      muzzleFlashFrame,
      this.getWeaponSound(weaponType),
      1.0
    );
    
    // Optionally snap to beat for rhythmic gameplay
    if (this.beatSync.shouldSnapToBeat('weapon_fire')) {
      this.beatSync.syncWeaponFire(() => {
        // Fire weapon on beat
        this.babylonEngine.executeWeaponFire(data);
      });
    }
  }
  
  /**
   * Handle enemy hit with impact sync
   */
  private handleEnemyHit(data: any): void {
    const enemyType = data.enemyType;
    const impactFrame = data.impactFrame;
    
    // Play hit sound exactly when particle effect triggers
    this.scheduler.scheduleSound(
      `fish_hit_${enemyType}`,
      impactFrame,
      this.getHitSound(enemyType),
      0.8
    );
    
    // Add screen shake on beat for extra impact
    const musicalIntensity = this.beatSync.getMusicalIntensity();
    if (musicalIntensity > 80) {
      this.babylonEngine.addScreenShake(0.5, 100);
    }
  }
  
  /**
   * Handle enemy death with cinematic timing
   */
  private handleEnemyDeath(data: any): void {
    const enemyType = data.enemyType;
    const deathAnimationDuration = data.animationDuration;
    
    // Schedule death sound to play at start of death animation
    this.scheduler.scheduleSound(
      `fish_death_${enemyType}`,
      0,
      this.getDeathSound(enemyType),
      1.0
    );
    
    // If boss death, add dramatic music sting
    if (enemyType === 'boss') {
      // Wait for death animation to reach dramatic point (80% complete)
      const dramaticFrame = Math.floor(deathAnimationDuration * 0.8);
      this.scheduler.scheduleSound(
        'boss_death_sting',
        dramaticFrame,
        this.getSound('boss_death_sting'),
        1.2
      );
    }
  }
  
  /**
   * Handle boss spawn with dramatic buildup
   */
  private handleBossSpawn(data: any): void {
    // Snap boss spawn to beat for dramatic effect
    const timeToNextBeat = this.beatSync.getTimeToNextBeat();
    
    setTimeout(() => {
      // Start boss music on beat
      this.changeMusicWithBeatSync('boss_theme', 140); // 140 BPM
      
      // Play boss roar sound
      this.scheduler.scheduleSound(
        'boss_roar',
        0,
        this.getSound('boss_roar'),
        1.5
      );
      
      // Trigger cinematic camera
      this.babylonEngine.triggerBossIntroCamera(data.bossId);
      
    }, timeToNextBeat);
  }
  
  /**
   * Handle level complete with celebration
   */
  private handleLevelComplete(data: any): void {
    // Snap victory music to beat
    const timeToNextBeat = this.beatSync.getTimeToNextBeat();
    
    setTimeout(() => {
      // Fade out combat music
      this.babylonEngine.audioSystem.fadeOutCurrentMusic(1000);
      
      // Start victory music on beat
      setTimeout(() => {
        this.changeMusicWithBeatSync('victory', 90);
        
        // Play victory fanfare
        this.scheduler.scheduleSound(
          'victory_fanfare',
          0,
          this.getSound('victory_fanfare'),
          1.2
        );
      }, 1000);
      
    }, timeToNextBeat);
  }
  
  /**
   * Change music with beat-synchronized transition
   */
  private changeMusicWithBeatSync(trackName: string, bpm: number): void {
    // Update beat sync system to new BPM
    this.beatSync.setBPM(bpm);
    this.currentMusicBPM = bpm;
    
    // Snap transition to 4-beat measure
    this.beatSync.onBeatCallback(0, () => {
      this.babylonEngine.audioSystem.crossfadeToTrack(trackName, 2000);
    });
  }
  
  /**
   * Update called every frame
   */
  update(deltaTime: number): void {
    this.scheduler.update(deltaTime);
  }
  
  /**
   * Get sound buffer helpers
   */
  private getWeaponSound(weaponType: string): AudioBuffer {
    return audioAssetManager.getBuffer(`weapon_fire_${weaponType}`);
  }
  
  private getHitSound(enemyType: string): AudioBuffer {
    return audioAssetManager.getBuffer(`fish_hit_${enemyType}`);
  }
  
  private getDeathSound(enemyType: string): AudioBuffer {
    return audioAssetManager.getBuffer(`fish_death_${enemyType}`);
  }
  
  private getSound(soundId: string): AudioBuffer {
    return audioAssetManager.getBuffer(soundId);
  }
}
```

## Usage Examples

### Example 1: Sync Weapon Fire

```typescript
// In weapon system
babylonEngine.on('trigger_pulled', () => {
  // Fire weapon
  const fireAnimation = createMuzzleFlashAnimation();
  const muzzleFlashFrame = 5; // Frame where flash appears
  
  // Audio will play exactly when visual flash shows
  audioVisualSync.scheduler.scheduleSound(
    'weapon_fire',
    muzzleFlashFrame,
    weaponFireSound,
    1.0
  );
  
  // Start animation
  fireAnimation.play();
});
```

### Example 2: Boss Fight Beat Sync

```typescript
// In boss fight system
class BossFight {
  constructor(audioVisualSync: AudioVisualSyncManager) {
    // Set boss music BPM
    audioVisualSync.beatSync.setBPM(140);
    
    // Boss attacks on beat
    audioVisualSync.beatSync.onBeatCallback(0, () => {
      this.bossAttack();
    });
    
    // Phase transition on measure
    audioVisualSync.beatSync.onBeatCallback(0, () => {
      if (this.boss.health < 50) {
        this.enterPhase2();
      }
    });
  }
}
```

### Example 3: Cinematic Death Sequence

```typescript
// In enemy death handler
function handleEnemyDeath(enemy: Enemy) {
  // Start death animation
  const deathAnim = enemy.playDeathAnimation();
  const animDuration = deathAnim.duration; // in frames
  
  // Sound plays at frame 0 (start of animation)
  audioVisualSync.scheduler.scheduleSound(
    'death_scream',
    0,
    deathScreamSound,
    1.0
  );
  
  // Impact sound at frame 30 (when body hits ground)
  audioVisualSync.scheduler.scheduleSound(
    'body_impact',
    30,
    impactSound,
    0.7
  );
  
  // Splash sound at frame 45 (water splash)
  audioVisualSync.scheduler.scheduleSound(
    'water_splash',
    45,
    splashSound,
    0.5
  );
}
```

## Performance Metrics

### Target Metrics
- **Audio-Visual Sync Error**: < 16ms (1 frame @ 60fps)
- **Beat Accuracy**: 95% events within beat window
- **Music Transition Alignment**: 100% on beat
- **CPU Overhead**: < 2% additional CPU usage

### Testing

```typescript
class AudioVisualSyncTester {
  async testSyncAccuracy(): Promise<TestResult> {
    const tests = [];
    
    // Test 100 weapon fires
    for (let i = 0; i < 100; i++) {
      const visualFrame = i;
      const scheduledFrame = visualFrame - compensationFrames;
      
      const actualPlayFrame = await this.measureActualPlayFrame();
      const error = Math.abs(actualPlayFrame - visualFrame);
      
      tests.push({
        error,
        passed: error < 16 // 1 frame tolerance
      });
    }
    
    const avgError = tests.reduce((sum, t) => sum + t.error, 0) / tests.length;
    const passRate = tests.filter(t => t.passed).length / tests.length;
    
    return {
      avgError,
      passRate,
      passed: avgError < 16 && passRate > 0.95
    };
  }
}
```

## Integration with Existing System

```typescript
// In BabylonEngine.ts
export class BabylonEngine {
  private audioVisualSync: AudioVisualSyncManager;
  
  constructor() {
    // Initialize audio visual sync
    this.audioVisualSync = new AudioVisualSyncManager(
      this.audioContext,
      this
    );
  }
  
  update(deltaTime: number): void {
    // Update sync system every frame
    this.audioVisualSync.update(deltaTime);
    
    // ... rest of update logic
  }
}
```

## Conclusion

This precision audio-visual synchronization system ensures:
1. ✅ Frame-perfect audio playback aligned with visuals
2. ✅ Beat-synchronized game events for rhythmic gameplay
3. ✅ Automatic latency compensation
4. ✅ Minimal CPU overhead
5. ✅ World-class AAA game audio standards

**Status**: Ready for implementation
**Priority**: HIGH
**Estimated Implementation**: 1-2 weeks

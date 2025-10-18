# 🎬 Advanced Visual Effects & Cinematic System

## Overview

This system elevates visual quality to AAA standards with professional particle effects, cinematic camera movements, and dramatic post-processing effects.

## Architecture

### 1. Advanced Particle System

```typescript
/**
 * AAA-quality particle effects system
 */
export class AdvancedParticleSystem {
  private scene: BABYLON.Scene;
  private particleSystems: Map<string, BABYLON.ParticleSystem> = new Map();
  private particlePool: Map<string, BABYLON.ParticleSystem[]> = new Map();
  
  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.initializeParticleSystems();
  }
  
  /**
   * Create AAA bullet trail with multiple layers
   */
  createBulletTrail(
    startPos: BABYLON.Vector3,
    endPos: BABYLON.Vector3,
    weaponType: string
  ): BulletTrailEffect {
    const trail = new BulletTrailEffect(this.scene);
    
    // Layer 1: Core trail (bright energy)
    const coreTrail = this.createCoreTrail(startPos, endPos, weaponType);
    coreTrail.diameter = 0.3;
    coreTrail.lifetime = 0.4;
    coreTrail.color = this.getWeaponTrailColor(weaponType);
    
    // Layer 2: Glow/bloom effect
    const glowTrail = this.createGlowTrail(startPos, endPos);
    glowTrail.diameter = 0.8;
    glowTrail.lifetime = 0.3;
    glowTrail.emissiveIntensity = 3.0;
    
    // Layer 3: Spark particles
    const sparkParticles = this.createSparkParticles(startPos, endPos);
    sparkParticles.particleCount = 50;
    sparkParticles.lifeTime = 0.2;
    
    // Layer 4: Underwater turbulence
    const turbulenceEffect = this.createUnderwaterTurbulence(startPos, endPos);
    turbulenceEffect.strength = 0.5;
    turbulenceEffect.frequency = 2.0;
    
    // Layer 5: Bubble trail
    const bubbleTrail = this.createBubbleTrail(startPos, endPos);
    bubbleTrail.bubbleCount = 20;
    bubbleTrail.size = 0.1;
    
    trail.addLayer(coreTrail);
    trail.addLayer(glowTrail);
    trail.addLayer(sparkParticles);
    trail.addLayer(turbulenceEffect);
    trail.addLayer(bubbleTrail);
    
    return trail;
  }
  
  /**
   * Create multi-layered explosion effect
   */
  createExplosionEffect(
    position: BABYLON.Vector3,
    explosionType: 'small' | 'medium' | 'large' | 'boss'
  ): ExplosionEffect {
    const explosion = new ExplosionEffect(this.scene, position);
    
    // Layer 1: Flash (instant bright flash)
    const flash = this.createFlashLayer(position, explosionType);
    flash.duration = 0.1;
    flash.intensity = explosionType === 'boss' ? 10.0 : 5.0;
    flash.color = new BABYLON.Color3(1, 0.9, 0.7);
    
    // Layer 2: Shockwave ring
    const shockwave = this.createShockwaveLayer(position, explosionType);
    shockwave.expansionSpeed = 30.0;
    shockwave.duration = 0.5;
    shockwave.distortionStrength = 0.8;
    
    // Layer 3: Fire/explosion particles
    const fireParticles = this.createFireParticles(position, explosionType);
    fireParticles.particleCount = explosionType === 'boss' ? 2000 : 500;
    fireParticles.speed = 15.0;
    fireParticles.lifeTime = 1.2;
    
    // Layer 4: Smoke plumes
    const smokePlumes = this.createSmokePlumes(position, explosionType);
    smokePlumes.particleCount = 300;
    smokePlumes.speed = 5.0;
    smokePlumes.lifeTime = 3.0;
    
    // Layer 5: Debris/fragments
    const debris = this.createDebrisParticles(position, explosionType);
    debris.fragmentCount = 100;
    debris.speed = 20.0;
    debris.gravity = 9.8;
    
    // Layer 6: Underwater distortion
    const waterDistortion = this.createWaterDistortion(position, explosionType);
    waterDistortion.radius = explosionType === 'boss' ? 15.0 : 5.0;
    waterDistortion.strength = 1.5;
    waterDistortion.duration = 2.0;
    
    // Layer 7: Bubble burst
    const bubbleBurst = this.createBubbleBurst(position, explosionType);
    bubbleBurst.bubbleCount = explosionType === 'boss' ? 500 : 200;
    bubbleBurst.burstSpeed = 25.0;
    
    // Layer 8: Light flash
    const lightFlash = this.createLightFlash(position, explosionType);
    lightFlash.intensity = explosionType === 'boss' ? 100.0 : 30.0;
    lightFlash.range = explosionType === 'boss' ? 50.0 : 20.0;
    lightFlash.duration = 0.8;
    
    // Add all layers
    explosion.addLayer(flash);
    explosion.addLayer(shockwave);
    explosion.addLayer(fireParticles);
    explosion.addLayer(smokePlumes);
    explosion.addLayer(debris);
    explosion.addLayer(waterDistortion);
    explosion.addLayer(bubbleBurst);
    explosion.addLayer(lightFlash);
    
    return explosion;
  }
  
  /**
   * Create realistic fish death effect
   */
  createFishDeathEffect(
    position: BABYLON.Vector3,
    fishType: string,
    damageType: string
  ): DeathEffect {
    const deathEffect = new DeathEffect(this.scene, position);
    
    // Blood particles (can be disabled for kid-friendly mode)
    if (this.settings.bloodEffectsEnabled) {
      const bloodParticles = this.createBloodParticles(position, fishType);
      bloodParticles.particleCount = 200;
      bloodParticles.color = new BABYLON.Color4(0.8, 0.1, 0.1, 1.0);
      bloodParticles.speed = 10.0;
      bloodParticles.dissipationRate = 0.5;
      deathEffect.addLayer(bloodParticles);
    }
    
    // Scale pieces (gore)
    const scaleDebris = this.createScaleDebris(position, fishType);
    scaleDebris.pieceCount = 50;
    scaleDebris.scaleSize = this.getFishScaleSize(fishType);
    deathEffect.addLayer(scaleDebris);
    
    // Impact shockwave
    const impactWave = this.createImpactShockwave(position);
    impactWave.radius = 3.0;
    impactWave.strength = 0.5;
    deathEffect.addLayer(impactWave);
    
    // Bubble explosion
    const bubbleExplosion = this.createBubbleExplosion(position);
    bubbleExplosion.bubbleCount = 100;
    deathEffect.addLayer(bubbleExplosion);
    
    // Light flash (for dramatic effect)
    const deathFlash = this.createDeathFlash(position);
    deathFlash.color = new BABYLON.Color3(1, 0.5, 0.5);
    deathFlash.intensity = 5.0;
    deathFlash.duration = 0.2;
    deathEffect.addLayer(deathFlash);
    
    return deathEffect;
  }
  
  /**
   * Create underwater turbulence effect
   */
  private createUnderwaterTurbulence(
    startPos: BABYLON.Vector3,
    endPos: BABYLON.Vector3
  ): TurbulenceEffect {
    const turbulence = new TurbulenceEffect(this.scene);
    
    // Create turbulence particles along path
    const particleSystem = new BABYLON.ParticleSystem('turbulence', 100, this.scene);
    
    // Emitter follows bullet path
    particleSystem.emitter = startPos;
    particleSystem.minEmitBox = endPos.subtract(startPos).scale(0.1);
    particleSystem.maxEmitBox = endPos.subtract(startPos).scale(0.9);
    
    // Particle properties
    particleSystem.particleTexture = new BABYLON.Texture('assets/particles/water_distortion.png', this.scene);
    particleSystem.minSize = 0.5;
    particleSystem.maxSize = 1.0;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 0.6;
    
    // Turbulent motion
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 1.0;
    particleSystem.updateSpeed = 0.02;
    
    // Color gradient (transparent blue-white)
    particleSystem.addColorGradient(0.0, new BABYLON.Color4(0.3, 0.5, 1.0, 0.0));
    particleSystem.addColorGradient(0.5, new BABYLON.Color4(0.5, 0.7, 1.0, 0.3));
    particleSystem.addColorGradient(1.0, new BABYLON.Color4(0.7, 0.9, 1.0, 0.0));
    
    // Size gradient
    particleSystem.addSizeGradient(0.0, 0.5);
    particleSystem.addSizeGradient(0.5, 1.0);
    particleSystem.addSizeGradient(1.0, 0.2);
    
    // Start emitting
    particleSystem.start();
    
    turbulence.particleSystem = particleSystem;
    turbulence.strength = 0.5;
    turbulence.frequency = 2.0;
    
    return turbulence;
  }
  
  /**
   * Create water distortion effect
   */
  private createWaterDistortion(
    position: BABYLON.Vector3,
    scale: 'small' | 'medium' | 'large' | 'boss'
  ): WaterDistortionEffect {
    const distortion = new WaterDistortionEffect(this.scene, position);
    
    // Create expanding sphere with displacement shader
    const distortionMesh = BABYLON.MeshBuilder.CreateSphere(
      'waterDistortion',
      { diameter: 1.0, segments: 32 },
      this.scene
    );
    distortionMesh.position = position;
    
    // Custom distortion shader
    const distortionMaterial = new BABYLON.ShaderMaterial(
      'waterDistortionShader',
      this.scene,
      {
        vertex: 'waterDistortion',
        fragment: 'waterDistortion'
      },
      {
        attributes: ['position', 'normal', 'uv'],
        uniforms: ['worldViewProjection', 'time', 'strength', 'frequency']
      }
    );
    
    distortionMesh.material = distortionMaterial;
    
    // Animate expansion and fade
    const maxRadius = scale === 'boss' ? 15.0 : scale === 'large' ? 10.0 : scale === 'medium' ? 5.0 : 2.0;
    const duration = 2000; // ms
    
    BABYLON.Animation.CreateAndStartAnimation(
      'distortionExpand',
      distortionMesh,
      'scaling',
      60,
      120,
      new BABYLON.Vector3(1, 1, 1),
      new BABYLON.Vector3(maxRadius, maxRadius, maxRadius),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    
    // Fade out
    distortionMaterial.alpha = 1.0;
    BABYLON.Animation.CreateAndStartAnimation(
      'distortionFade',
      distortionMaterial,
      'alpha',
      60,
      120,
      1.0,
      0.0,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    
    // Clean up after animation
    setTimeout(() => {
      distortionMesh.dispose();
    }, duration);
    
    distortion.mesh = distortionMesh;
    distortion.strength = 1.5;
    distortion.duration = duration;
    
    return distortion;
  }
  
  /**
   * Create procedural bubble particles
   */
  createProceduralBubbles(
    position: BABYLON.Vector3,
    count: number,
    sizeRange: [number, number]
  ): BubbleSystem {
    const bubbleSystem = new BubbleSystem(this.scene);
    
    const particleSystem = new BABYLON.ParticleSystem('bubbles', count, this.scene);
    particleSystem.emitter = position;
    
    // Bubble texture (spherical with refraction)
    particleSystem.particleTexture = new BABYLON.Texture('assets/particles/bubble.png', this.scene);
    
    // Size based on physics (smaller bubbles = higher pitch sound)
    particleSystem.minSize = sizeRange[0];
    particleSystem.maxSize = sizeRange[1];
    
    // Bubbles rise with buoyancy
    particleSystem.direction1 = new BABYLON.Vector3(-0.5, 5, -0.5);
    particleSystem.direction2 = new BABYLON.Vector3(0.5, 8, 0.5);
    
    // Gravity (negative for upward force)
    particleSystem.gravity = new BABYLON.Vector3(0, -2, 0);
    
    // Lifetime based on depth
    particleSystem.minLifeTime = 2.0;
    particleSystem.maxLifeTime = 5.0;
    
    // Color (transparent with slight blue tint)
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.9, 1.0, 0.3);
    particleSystem.color2 = new BABYLON.Color4(0.8, 0.95, 1.0, 0.5);
    
    // Add wobble motion
    particleSystem.addVelocityGradient(0, 1.0);
    particleSystem.addVelocityGradient(0.5, 0.8);
    particleSystem.addVelocityGradient(1.0, 0.5);
    
    // Add rotation for realism
    particleSystem.minAngularSpeed = -Math.PI;
    particleSystem.maxAngularSpeed = Math.PI;
    
    particleSystem.start();
    
    bubbleSystem.particleSystem = particleSystem;
    
    return bubbleSystem;
  }
}
```

### 2. Cinematic Camera System

```typescript
/**
 * Professional cinematic camera system
 */
export class CinematicCameraSystem {
  private scene: BABYLON.Scene;
  private camera: BABYLON.ArcRotateCamera;
  private originalCameraState: CameraState;
  private cinematicActive: boolean = false;
  
  constructor(scene: BABYLON.Scene, camera: BABYLON.ArcRotateCamera) {
    this.scene = scene;
    this.camera = camera;
    this.saveCameraState();
  }
  
  /**
   * Create kill cam effect
   */
  createKillCam(
    killerPos: BABYLON.Vector3,
    victimPos: BABYLON.Vector3,
    killType: string
  ): void {
    if (this.cinematicActive) return;
    
    this.cinematicActive = true;
    this.saveCameraState();
    
    // Slow down time
    this.scene.getEngine().setTimeScale(0.25); // 25% speed
    
    // Calculate dramatic camera angle
    const midPoint = BABYLON.Vector3.Lerp(killerPos, victimPos, 0.5);
    const direction = victimPos.subtract(killerPos);
    const distance = direction.length();
    
    // Side angle for dramatic view
    const perpendicular = new BABYLON.Vector3(-direction.z, 0, direction.x).normalize();
    const cameraPos = midPoint.add(perpendicular.scale(distance * 0.7)).add(new BABYLON.Vector3(0, 5, 0));
    
    // Smooth camera movement
    const killCamDuration = 2500; // ms
    
    BABYLON.Animation.CreateAndStartAnimation(
      'killCamPosition',
      this.camera,
      'position',
      60,
      150,
      this.camera.position,
      cameraPos,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      new BABYLON.CubicEase()
    );
    
    BABYLON.Animation.CreateAndStartAnimation(
      'killCamTarget',
      this.camera,
      'target',
      60,
      150,
      this.camera.target,
      victimPos,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      new BABYLON.CubicEase()
    );
    
    // Add motion blur
    this.addMotionBlur(0.8);
    
    // Add chromatic aberration for dramatic effect
    this.addChromaticAberration(0.5);
    
    // Play dramatic whoosh sound
    this.scene.audioEngine.playSound('kill_cam_whoosh', { volume: 0.7 });
    
    // Resume after duration
    setTimeout(() => {
      this.endCinematic();
    }, killCamDuration);
  }
  
  /**
   * Create boss introduction camera sequence
   */
  async createBossIntroCamera(bossPos: BABYLON.Vector3, bossName: string): Promise<void> {
    this.cinematicActive = true;
    this.saveCameraState();
    
    const sequence = [
      // Shot 1: Wide establishing shot
      {
        duration: 3000,
        position: bossPos.add(new BABYLON.Vector3(0, 20, -30)),
        target: bossPos,
        fov: 0.8
      },
      // Shot 2: Low angle hero shot
      {
        duration: 2000,
        position: bossPos.add(new BABYLON.Vector3(0, -5, 15)),
        target: bossPos.add(new BABYLON.Vector3(0, 5, 0)),
        fov: 0.6
      },
      // Shot 3: Close-up on face/eyes
      {
        duration: 2000,
        position: bossPos.add(new BABYLON.Vector3(0, 3, -8)),
        target: bossPos.add(new BABYLON.Vector3(0, 3, 0)),
        fov: 0.4
      },
      // Shot 4: Pull back to gameplay position
      {
        duration: 2000,
        position: this.originalCameraState.position,
        target: bossPos,
        fov: 0.8
      }
    ];
    
    for (const shot of sequence) {
      await this.executeShot(shot);
    }
    
    this.endCinematic();
  }
  
  /**
   * Execute a single camera shot
   */
  private async executeShot(shot: CameraShot): Promise<void> {
    return new Promise((resolve) => {
      // Animate position
      BABYLON.Animation.CreateAndStartAnimation(
        'shotPosition',
        this.camera,
        'position',
        60,
        (shot.duration / 1000) * 60,
        this.camera.position,
        shot.position,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase()
      );
      
      // Animate target
      BABYLON.Animation.CreateAndStartAnimation(
        'shotTarget',
        this.camera,
        'target',
        60,
        (shot.duration / 1000) * 60,
        this.camera.target,
        shot.target,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase()
      );
      
      // Animate FOV
      BABYLON.Animation.CreateAndStartAnimation(
        'shotFOV',
        this.camera,
        'fov',
        60,
        (shot.duration / 1000) * 60,
        this.camera.fov,
        shot.fov,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase()
      );
      
      setTimeout(() => resolve(), shot.duration);
    });
  }
  
  /**
   * Add screen shake effect
   */
  addScreenShake(intensity: number, duration: number): void {
    const originalPos = this.camera.position.clone();
    const shakeInterval = 16; // 60 FPS
    let elapsed = 0;
    
    const shakeTimer = setInterval(() => {
      elapsed += shakeInterval;
      
      // Decay intensity over time
      const currentIntensity = intensity * (1 - elapsed / duration);
      
      const shake = new BABYLON.Vector3(
        (Math.random() - 0.5) * currentIntensity,
        (Math.random() - 0.5) * currentIntensity,
        (Math.random() - 0.5) * currentIntensity
      );
      
      this.camera.position = originalPos.add(shake);
      
      if (elapsed >= duration) {
        clearInterval(shakeTimer);
        this.camera.position = originalPos;
      }
    }, shakeInterval);
  }
  
  /**
   * Create slow motion moment
   */
  createSlowMotionMoment(duration: number = 1500, timeScale: number = 0.2): void {
    // Slow down time
    this.scene.getEngine().setTimeScale(timeScale);
    
    // Add bullet time VFX
    this.addBulletTimeVFX();
    
    // Slow down audio
    this.scene.audioEngine.setGlobalPitchShift(timeScale);
    
    // Add bass boost for dramatic effect
    this.scene.audioEngine.setBassBoost(2.0);
    
    // Resume after duration
    setTimeout(() => {
      this.scene.getEngine().setTimeScale(1.0);
      this.removeBulletTimeVFX();
      this.scene.audioEngine.setGlobalPitchShift(1.0);
      this.scene.audioEngine.setBassBoost(1.0);
    }, duration / timeScale); // Adjust for time scale
  }
  
  /**
   * Add motion blur effect
   */
  private addMotionBlur(intensity: number): void {
    const motionBlur = new BABYLON.MotionBlurPostProcess(
      'motionBlur',
      this.scene,
      intensity,
      this.camera
    );
    motionBlur.motionStrength = intensity;
    motionBlur.motionBlurSamples = 32;
  }
  
  /**
   * Add bullet time VFX
   */
  private addBulletTimeVFX(): void {
    // Radial blur
    const radialBlur = new BABYLON.RadialBlurPostProcess(
      'bulletTimeBlur',
      this.scene.activeCamera!,
      0.3,
      0.8,
      1024
    );
    
    // Chromatic aberration
    this.addChromaticAberration(0.3);
    
    // Vignette
    const vignette = new BABYLON.VignettePostProcess(
      'bulletTimeVignette',
      0.8,
      this.scene.activeCamera!
    );
  }
  
  /**
   * Add chromatic aberration
   */
  private addChromaticAberration(intensity: number): void {
    const chromaticAberration = new BABYLON.ChromaticAberrationPostProcess(
      'chromatic',
      intensity,
      this.camera
    );
    chromaticAberration.radialIntensity = intensity;
    chromaticAberration.direction = new BABYLON.Vector2(1, 0);
  }
  
  /**
   * End cinematic and restore camera
   */
  private endCinematic(): void {
    this.restoreCameraState();
    this.cinematicActive = false;
    this.scene.getEngine().setTimeScale(1.0);
    this.removeAllPostProcessing();
  }
  
  /**
   * Save camera state
   */
  private saveCameraState(): void {
    this.originalCameraState = {
      position: this.camera.position.clone(),
      target: this.camera.target.clone(),
      fov: this.camera.fov,
      alpha: this.camera.alpha,
      beta: this.camera.beta,
      radius: this.camera.radius
    };
  }
  
  /**
   * Restore camera state
   */
  private restoreCameraState(): void {
    this.camera.position = this.originalCameraState.position;
    this.camera.target = this.originalCameraState.target;
    this.camera.fov = this.originalCameraState.fov;
  }
}

interface CameraShot {
  duration: number;
  position: BABYLON.Vector3;
  target: BABYLON.Vector3;
  fov: number;
}

interface CameraState {
  position: BABYLON.Vector3;
  target: BABYLON.Vector3;
  fov: number;
  alpha: number;
  beta: number;
  radius: number;
}
```

## Integration

```typescript
// In BabylonEngine.ts
export class BabylonEngine {
  private advancedVFX: AdvancedParticleSystem;
  private cinematicCamera: CinematicCameraSystem;
  
  constructor() {
    this.advancedVFX = new AdvancedParticleSystem(this.scene);
    this.cinematicCamera = new CinematicCameraSystem(this.scene, this.camera);
  }
  
  // Use in game events
  onWeaponFire(data: any): void {
    const trail = this.advancedVFX.createBulletTrail(
      data.startPos,
      data.endPos,
      data.weaponType
    );
  }
  
  onEnemyKill(data: any): void {
    // Cinematic kill cam
    if (data.killType === 'critical' || data.killType === 'headshot') {
      this.cinematicCamera.createKillCam(
        data.killerPos,
        data.victimPos,
        data.killType
      );
    }
    
    // Death effects
    this.advancedVFX.createFishDeathEffect(
      data.position,
      data.fishType,
      data.damageType
    );
  }
  
  onBossSpawn(data: any): void {
    this.cinematicCamera.createBossIntroCamera(
      data.bossPos,
      data.bossName
    );
  }
}
```

## Expected Results

### Visual Quality Improvements
- **Particle Count**: 5000+ simultaneous particles (up from 500)
- **Effect Layers**: 8+ layers per explosion (up from 2)
- **Visual Fidelity**: AAA console-quality effects
- **Performance**: Maintained 60 FPS on desktop

### Cinematic Features
- ✅ Professional kill cams
- ✅ Dramatic boss introductions
- ✅ Slow motion moments
- ✅ Screen shake and camera effects
- ✅ Post-processing effects

**Status**: Ready for implementation
**Priority**: HIGH
**Estimated Time**: 2 weeks

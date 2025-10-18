# 🎬 Storytelling & Engagement System - Addictive Gameplay Framework

## Overview

This system creates a compelling, addictive gameplay experience through narrative progression, dynamic difficulty adjustment, and continuous player engagement optimization.

## Architecture

### 1. Campaign Story System

```typescript
/**
 * Main story campaign with chapters, bosses, and narrative progression
 */
export interface Chapter {
  id: number;
  title: string;
  titleVN: string;
  description: string;
  difficulty: DifficultyLevel;
  objectives: Objective[];
  bossEncounter: BossEncounter;
  rewards: Reward[];
  lore: LoreEntry[];
  musicTheme: string;
  environmentSettings: EnvironmentSettings;
  unlockRequirements: UnlockRequirements;
}

export interface Objective {
  id: string;
  type: 'hunt' | 'collect' | 'survive' | 'explore' | 'protect' | 'boss';
  description: string;
  target: string;
  targetCount?: number;
  duration?: number;
  progress: number;
  completed: boolean;
  reward: Reward;
}

export interface BossEncounter {
  id: string;
  name: string;
  nameVN: string;
  modelType: string;
  loreTitle: string;
  loreDescription: string;
  health: number;
  damage: number;
  speed: number;
  weaknesses: string[];
  resistances: string[];
  specialAttacks: SpecialAttack[];
  phases: BossPhase[];
  cinematicIntro: CinematicData;
  defeatCinematic: CinematicData;
}

export class StorytellingSystem {
  private chapters: Chapter[] = [];
  private currentChapter: number = 0;
  private unlockedChapters: Set<number> = new Set([0]);
  private playerProgress: PlayerProgress;
  private narrativeState: NarrativeState;
  
  constructor(private babylonEngine: BabylonEngine) {
    this.initializeChapters();
    this.loadPlayerProgress();
  }
  
  /**
   * Initialize all story chapters
   */
  private initializeChapters(): void {
    this.chapters = [
      // Chapter 1: Tutorial & Introduction
      {
        id: 0,
        title: "The Calm Waters",
        titleVN: "Vùng Biển Yên Tĩnh",
        description: "Begin your journey as a rookie underwater hunter. Learn the basics and make your first catches in the peaceful shallow waters.",
        difficulty: 'easy',
        objectives: [
          {
            id: 'obj_0_1',
            type: 'hunt',
            description: 'Hunt 20 small fish',
            target: 'small_fish',
            targetCount: 20,
            progress: 0,
            completed: false,
            reward: { coins: 500, xp: 100 }
          },
          {
            id: 'obj_0_2',
            type: 'collect',
            description: 'Collect 1000 coins',
            target: 'coins',
            targetCount: 1000,
            progress: 0,
            completed: false,
            reward: { coins: 200, xp: 50 }
          },
          {
            id: 'obj_0_3',
            type: 'survive',
            description: 'Survive for 3 minutes',
            target: 'time',
            duration: 180,
            progress: 0,
            completed: false,
            reward: { coins: 300, xp: 75 }
          }
        ],
        bossEncounter: {
          id: 'boss_tuna_king',
          name: "Tuna King",
          nameVN: "Vua Cá Ngừ",
          modelType: 'large_tuna',
          loreTitle: "The Guardian of Shallow Waters",
          loreDescription: "A massive tuna that has ruled these waters for decades. Local fishermen speak of its incredible speed and cunning. Defeat it to prove you're ready for deeper challenges.",
          health: 5000,
          damage: 100,
          speed: 8,
          weaknesses: ['rapid_fire', 'net_trap'],
          resistances: ['explosive'],
          specialAttacks: [
            {
              name: 'Ramming Charge',
              damage: 200,
              cooldown: 8000,
              animation: 'charge_attack',
              soundEffect: 'boss_charge'
            },
            {
              name: 'Tail Whip',
              damage: 150,
              cooldown: 5000,
              animation: 'tail_whip',
              soundEffect: 'tail_whip'
            }
          ],
          phases: [
            {
              healthThreshold: 100,
              behaviorChanges: { aggression: 0.5, speed: 1.0 }
            },
            {
              healthThreshold: 50,
              behaviorChanges: { aggression: 0.8, speed: 1.3 },
              unlockAbilities: ['Whirlpool']
            },
            {
              healthThreshold: 25,
              behaviorChanges: { aggression: 1.0, speed: 1.5 },
              unlockAbilities: ['Frenzy Mode']
            }
          ],
          cinematicIntro: {
            duration: 8000,
            cameraPath: 'boss_intro_cam_1',
            dialogue: [
              {
                speaker: 'Narrator',
                text: 'The legendary Tuna King emerges from the depths...',
                duration: 3000
              }
            ]
          },
          defeatCinematic: {
            duration: 5000,
            cameraPath: 'boss_defeat_cam_1',
            dialogue: [
              {
                speaker: 'Narrator',
                text: 'Victory! The shallow waters are now safe.',
                duration: 2000
              }
            ]
          }
        },
        rewards: [
          {
            type: 'weapon',
            id: 'double_barrel_harpoon',
            name: 'Double Barrel Harpoon',
            description: 'Fire two harpoons simultaneously'
          },
          {
            type: 'ability',
            id: 'dash_boost',
            name: 'Dash Boost',
            description: 'Quick burst of speed'
          },
          {
            type: 'cosmetic',
            id: 'rookie_skin',
            name: 'Rookie Diver Skin'
          }
        ],
        lore: [
          {
            id: 'lore_1',
            title: 'The Legend of Tuna King',
            content: 'Local fishermen tell stories of a massive tuna that has protected these waters for generations. Some say it\'s over 50 years old...',
            unlockCondition: 'defeat_boss'
          }
        ],
        musicTheme: 'underwater_theme',
        environmentSettings: {
          waterColor: new BABYLON.Color3(0.4, 0.7, 0.9),
          depth: 20,
          visibility: 100,
          currentStrength: 0.3
        },
        unlockRequirements: {
          previousChapter: null,
          minimumLevel: 0
        }
      },
      
      // Chapter 2: The Dark Cavern
      {
        id: 1,
        title: "The Mysterious Cavern",
        titleVN: "Hang Động Bí Ẩn",
        description: "Venture into the dark underwater caves where dangerous predators lurk. Ancient treasures await those brave enough to explore.",
        difficulty: 'medium',
        objectives: [
          {
            id: 'obj_1_1',
            type: 'explore',
            description: 'Explore 80% of the cavern',
            target: 'cavern_area',
            targetCount: 80,
            progress: 0,
            completed: false,
            reward: { coins: 1000, xp: 250 }
          },
          {
            id: 'obj_1_2',
            type: 'hunt',
            description: 'Hunt 15 cave predators',
            target: 'cave_predator',
            targetCount: 15,
            progress: 0,
            completed: false,
            reward: { coins: 800, xp: 200 }
          },
          {
            id: 'obj_1_3',
            type: 'collect',
            description: 'Find the Ancient Artifact',
            target: 'ancient_artifact',
            targetCount: 1,
            progress: 0,
            completed: false,
            reward: { coins: 2000, xp: 500 }
          }
        ],
        bossEncounter: {
          id: 'boss_abyss_horror',
          name: "Abyss Horror",
          nameVN: "Quỷ Vực Thẳm",
          modelType: 'anglerfish_monster',
          loreTitle: "Guardian of the Ancient Depths",
          loreDescription: "An ancient creature from prehistoric times, guarding a forgotten treasure. Its bioluminescent lure has hypnotized countless victims.",
          health: 12000,
          damage: 180,
          speed: 5,
          weaknesses: ['light_damage', 'explosive'],
          resistances: ['dark', 'poison'],
          specialAttacks: [
            {
              name: 'Hypnotic Lure',
              damage: 0,
              effect: 'stun',
              duration: 3000,
              cooldown: 12000,
              animation: 'lure_attack',
              soundEffect: 'hypnotic_sound'
            },
            {
              name: 'Darkness Blast',
              damage: 250,
              cooldown: 8000,
              animation: 'darkness_blast',
              soundEffect: 'dark_blast'
            },
            {
              name: 'Tentacle Grab',
              damage: 200,
              effect: 'immobilize',
              duration: 2000,
              cooldown: 10000,
              animation: 'tentacle_grab',
              soundEffect: 'tentacle_grab'
            }
          ],
          phases: [
            {
              healthThreshold: 100,
              behaviorChanges: { aggression: 0.6, speed: 1.0 },
              environmentChanges: { darkness: 0.5 }
            },
            {
              healthThreshold: 60,
              behaviorChanges: { aggression: 0.8, speed: 1.2 },
              environmentChanges: { darkness: 0.7 },
              unlockAbilities: ['Poison Cloud']
            },
            {
              healthThreshold: 30,
              behaviorChanges: { aggression: 1.0, speed: 1.4 },
              environmentChanges: { darkness: 0.9 },
              unlockAbilities: ['Enrage Mode', 'Summon Minions']
            }
          ],
          cinematicIntro: {
            duration: 10000,
            cameraPath: 'boss_intro_cam_2',
            dialogue: [
              {
                speaker: 'Narrator',
                text: 'The darkness moves... something ancient stirs...',
                duration: 4000
              },
              {
                speaker: 'Narrator',
                text: 'The Abyss Horror has awakened!',
                duration: 3000
              }
            ]
          },
          defeatCinematic: {
            duration: 8000,
            cameraPath: 'boss_defeat_cam_2',
            dialogue: [
              {
                speaker: 'Narrator',
                text: 'The ancient guardian falls. The artifact is yours.',
                duration: 3000
              }
            ]
          }
        },
        rewards: [
          {
            type: 'weapon',
            id: 'plasma_cannon',
            name: 'Plasma Cannon',
            description: 'Devastating energy weapon'
          },
          {
            type: 'ability',
            id: 'sonar_vision',
            name: 'Sonar Vision',
            description: 'See through darkness'
          },
          {
            type: 'cosmetic',
            id: 'cave_explorer_skin',
            name: 'Cave Explorer Skin'
          }
        ],
        lore: [
          {
            id: 'lore_2',
            title: 'The Ancient Civilization',
            content: 'These caves were once home to an advanced underwater civilization. The artifact you seek is said to hold great power...',
            unlockCondition: 'explore_50_percent'
          },
          {
            id: 'lore_3',
            title: 'The Abyss Horror Origin',
            content: 'Scientists believe this creature is over 10,000 years old, a living fossil from the age of dinosaurs...',
            unlockCondition: 'defeat_boss'
          }
        ],
        musicTheme: 'action_underwater',
        environmentSettings: {
          waterColor: new BABYLON.Color3(0.1, 0.2, 0.3),
          depth: 80,
          visibility: 30,
          currentStrength: 0.5,
          darkness: 0.8
        },
        unlockRequirements: {
          previousChapter: 0,
          minimumLevel: 5
        }
      },
      
      // Chapter 3-10 would follow similar pattern
      // Each with increasing difficulty, complexity, and rewards
    ];
  }
  
  /**
   * Start a chapter
   */
  async startChapter(chapterId: number): Promise<void> {
    if (!this.unlockedChapters.has(chapterId)) {
      throw new Error(`Chapter ${chapterId} is not unlocked`);
    }
    
    const chapter = this.chapters[chapterId];
    this.currentChapter = chapterId;
    
    // Show chapter intro cinematic
    await this.showChapterIntro(chapter);
    
    // Setup chapter environment
    this.setupChapterEnvironment(chapter);
    
    // Load chapter objectives
    this.loadChapterObjectives(chapter);
    
    // Start chapter music
    this.babylonEngine.audioSystem.crossfadeToTrack(chapter.musicTheme, 3000);
    
    // Trigger chapter start event
    this.babylonEngine.emit('chapter_started', { chapterId, chapter });
  }
  
  /**
   * Show chapter intro cinematic
   */
  private async showChapterIntro(chapter: Chapter): Promise<void> {
    return new Promise((resolve) => {
      // Create full-screen cinematic UI
      const cinematicUI = this.createCinematicUI(chapter);
      
      // Play narrator voice over
      this.babylonEngine.audioSystem.playNarration(chapter.narratorAudio);
      
      // Show chapter title and description
      cinematicUI.showTitle(chapter.titleVN, chapter.description);
      
      // Atmospheric background
      cinematicUI.showBackground(chapter.cinematicBackground);
      
      // After duration, close cinematic
      setTimeout(() => {
        cinematicUI.fadeOut(2000);
        resolve();
      }, 12000);
    });
  }
  
  /**
   * Update objective progress
   */
  updateObjectiveProgress(objectiveId: string, progress: number): void {
    const chapter = this.chapters[this.currentChapter];
    const objective = chapter.objectives.find(obj => obj.id === objectiveId);
    
    if (objective) {
      objective.progress = progress;
      
      // Check if objective completed
      if (progress >= (objective.targetCount || objective.duration || 100)) {
        this.completeObjective(objective);
      }
      
      // Update UI
      this.babylonEngine.ui.updateObjectiveProgress(objectiveId, progress);
    }
  }
  
  /**
   * Complete objective
   */
  private completeObjective(objective: Objective): void {
    objective.completed = true;
    
    // Show completion notification
    this.babylonEngine.ui.showObjectiveComplete(objective);
    
    // Play completion sound
    this.babylonEngine.audioSystem.playSound('objective_complete');
    
    // Grant rewards
    this.grantRewards(objective.reward);
    
    // Check if all objectives complete
    const allComplete = this.chapters[this.currentChapter].objectives
      .every(obj => obj.completed);
    
    if (allComplete) {
      this.triggerBossEncounter();
    }
  }
  
  /**
   * Trigger boss encounter
   */
  private async triggerBossEncounter(): Promise<void> {
    const chapter = this.chapters[this.currentChapter];
    const boss = chapter.bossEncounter;
    
    // Show boss intro cinematic
    await this.showBossIntro(boss);
    
    // Change music to boss theme
    this.babylonEngine.audioSystem.crossfadeToTrack('boss_theme', 2000);
    
    // Spawn boss
    this.babylonEngine.spawnBoss(boss);
    
    // Start boss fight mechanics
    this.startBossFight(boss);
  }
  
  /**
   * Show boss intro cinematic
   */
  private async showBossIntro(boss: BossEncounter): Promise<void> {
    return new Promise((resolve) => {
      // Dramatic camera movement
      this.babylonEngine.camera.playCameraPath(boss.cinematicIntro.cameraPath);
      
      // Show boss name and lore
      this.babylonEngine.ui.showBossIntro({
        name: boss.nameVN,
        title: boss.loreTitle,
        description: boss.loreDescription
      });
      
      // Play dramatic music sting
      this.babylonEngine.audioSystem.playSound('boss_intro_sting');
      
      // Dialogue
      boss.cinematicIntro.dialogue.forEach((line, index) => {
        setTimeout(() => {
          this.babylonEngine.ui.showDialogue(line);
        }, index * 3000);
      });
      
      setTimeout(() => {
        resolve();
      }, boss.cinematicIntro.duration);
    });
  }
  
  /**
   * Handle boss defeat
   */
  onBossDefeated(bossId: string): void {
    const chapter = this.chapters[this.currentChapter];
    
    // Show defeat cinematic
    this.showBossDefeatCinematic(chapter.bossEncounter);
    
    // Grant chapter rewards
    this.grantChapterRewards(chapter);
    
    // Unlock next chapter
    this.unlockNextChapter();
    
    // Show chapter complete screen
    this.showChapterComplete(chapter);
  }
  
  /**
   * Grant chapter rewards
   */
  private grantChapterRewards(chapter: Chapter): void {
    chapter.rewards.forEach(reward => {
      // Grant reward to player
      this.playerProgress.unlockReward(reward);
      
      // Show reward notification
      this.babylonEngine.ui.showRewardUnlocked(reward);
    });
    
    // Unlock lore entries
    chapter.lore.forEach(lore => {
      if (lore.unlockCondition === 'defeat_boss') {
        this.playerProgress.unlockLore(lore);
      }
    });
  }
  
  /**
   * Unlock next chapter
   */
  private unlockNextChapter(): void {
    const nextChapterId = this.currentChapter + 1;
    if (nextChapterId < this.chapters.length) {
      this.unlockedChapters.add(nextChapterId);
      this.babylonEngine.ui.showNotification({
        title: 'New Chapter Unlocked!',
        message: this.chapters[nextChapterId].titleVN,
        type: 'success'
      });
    }
  }
}
```

### 2. Engagement Tracking System

```typescript
/**
 * Tracks player engagement and adjusts game experience
 */
export class EngagementTracker {
  private metrics: PlayerMetrics = {
    playTime: 0,
    kills: 0,
    deaths: 0,
    accuracy: 0,
    coinsCollected: 0,
    achievementsUnlocked: 0,
    chaptersCompleted: 0,
    bossesDefeated: 0,
    lastSessionDuration: 0,
    sessionsPlayed: 0,
    averageSessionLength: 0,
    longestStreak: 0,
    currentStreak: 0
  };
  
  private engagementScore: number = 50; // 0-100
  private engagementHistory: EngagementSnapshot[] = [];
  private lastUpdateTime: number = Date.now();
  
  constructor(private babylonEngine: BabylonEngine) {
    this.startTracking();
  }
  
  /**
   * Start engagement tracking
   */
  private startTracking(): void {
    // Update metrics every 30 seconds
    setInterval(() => {
      this.updateMetrics();
      this.calculateEngagement();
      this.adjustGameExperience();
    }, 30000);
  }
  
  /**
   * Calculate engagement score
   */
  private calculateEngagement(): void {
    const factors = {
      skillImprovement: this.calculateSkillImprovement(),
      contentProgress: this.calculateContentProgress(),
      sessionQuality: this.calculateSessionQuality(),
      achievementRate: this.calculateAchievementRate(),
      challengeBalance: this.calculateChallengeBalance(),
      socialEngagement: this.calculateSocialEngagement()
    };
    
    // Weighted engagement score
    this.engagementScore = 
      factors.skillImprovement * 0.20 +
      factors.contentProgress * 0.15 +
      factors.sessionQuality * 0.20 +
      factors.achievementRate * 0.15 +
      factors.challengeBalance * 0.20 +
      factors.socialEngagement * 0.10;
    
    // Store snapshot
    this.engagementHistory.push({
      timestamp: Date.now(),
      score: this.engagementScore,
      factors
    });
    
    console.log(`Engagement Score: ${this.engagementScore.toFixed(1)}/100`, factors);
  }
  
  /**
   * Calculate skill improvement
   */
  private calculateSkillImprovement(): number {
    // Compare recent performance to past performance
    const recentAccuracy = this.getRecentAccuracy(5); // Last 5 minutes
    const pastAccuracy = this.getPastAccuracy(30); // 30 minutes ago
    
    const improvement = recentAccuracy - pastAccuracy;
    
    // Normalize to 0-100
    return Math.max(0, Math.min(100, 50 + improvement * 2));
  }
  
  /**
   * Calculate content progress
   */
  private calculateContentProgress(): number {
    const totalChapters = 10;
    const chaptersCompleted = this.metrics.chaptersCompleted;
    
    // Rate of progress
    const progressRate = chaptersCompleted / Math.max(this.metrics.playTime / 3600000, 1); // Chapters per hour
    
    // Target: 0.5 chapters per hour
    const targetRate = 0.5;
    const scoreFromRate = Math.min(progressRate / targetRate * 100, 100);
    
    return scoreFromRate;
  }
  
  /**
   * Calculate session quality
   */
  private calculateSessionQuality(): number {
    const currentSession = Date.now() - this.lastUpdateTime;
    
    // Ideal session: 30-60 minutes
    const idealMin = 30 * 60 * 1000; // 30 minutes
    const idealMax = 60 * 60 * 1000; // 60 minutes
    
    if (currentSession < idealMin) {
      // Too short
      return (currentSession / idealMin) * 100;
    } else if (currentSession <= idealMax) {
      // Perfect length
      return 100;
    } else {
      // Too long (player might be getting tired)
      const overtime = currentSession - idealMax;
      return Math.max(50, 100 - (overtime / idealMax) * 50);
    }
  }
  
  /**
   * Calculate achievement rate
   */
  private calculateAchievementRate(): number {
    // Achievements per hour played
    const achievementsPerHour = this.metrics.achievementsUnlocked / 
      Math.max(this.metrics.playTime / 3600000, 1);
    
    // Target: 2-3 achievements per hour
    const targetRate = 2.5;
    return Math.min((achievementsPerHour / targetRate) * 100, 100);
  }
  
  /**
   * Calculate challenge balance
   */
  private calculateChallengeBalance(): number {
    const kdRatio = this.metrics.kills / Math.max(this.metrics.deaths, 1);
    
    // Perfect K/D ratio: 3-5
    if (kdRatio >= 3 && kdRatio <= 5) {
      return 100; // Perfect balance
    } else if (kdRatio < 1) {
      return 20; // Too hard, very frustrating
    } else if (kdRatio < 2) {
      return 40; // Hard, somewhat frustrating
    } else if (kdRatio < 3) {
      return 70; // Slightly easy
    } else if (kdRatio <= 8) {
      return 60; // Too easy
    } else {
      return 30; // Way too easy, boring
    }
  }
  
  /**
   * Adjust game experience based on engagement
   */
  private adjustGameExperience(): void {
    // Low engagement - make game more rewarding
    if (this.engagementScore < 40) {
      console.log('⚠️ Low engagement detected. Boosting rewards...');
      
      // Increase rewards
      this.babylonEngine.setLootMultiplier(2.0);
      
      // Spawn special events
      this.babylonEngine.triggerSpecialEvent('treasure_school');
      
      // Make game easier
      this.babylonEngine.adjustDifficulty(-0.3);
      
      // More frequent achievements
      this.babylonEngine.achievementSystem.increaseUnlockRate(1.5);
      
      // Encouraging feedback
      this.babylonEngine.ui.showEncouragement('You\'re doing great! Keep it up!');
    }
    
    // Moderate engagement - maintain current state
    else if (this.engagementScore >= 40 && this.engagementScore < 70) {
      console.log('✅ Good engagement. Maintaining current experience.');
      
      // Reset to normal multipliers
      this.babylonEngine.setLootMultiplier(1.0);
      this.babylonEngine.adjustDifficulty(0);
    }
    
    // High engagement - increase challenge
    else if (this.engagementScore >= 70 && this.engagementScore < 85) {
      console.log('🔥 High engagement! Adding more challenge...');
      
      // Increase difficulty slightly
      this.babylonEngine.adjustDifficulty(0.2);
      
      // Better rewards
      this.babylonEngine.setLootMultiplier(1.3);
      
      // Epic moments
      if (Math.random() < 0.3) {
        this.babylonEngine.triggerEpicMoment();
      }
    }
    
    // Very high engagement but too easy
    else if (this.engagementScore >= 85 && this.metrics.accuracy > 75) {
      console.log('⚡ Player is dominating! Spawning boss challenge...');
      
      // Spawn mini-boss
      this.babylonEngine.spawnMiniBoss();
      
      // Harder difficulty
      this.babylonEngine.adjustDifficulty(0.4);
      
      // Epic music
      this.babylonEngine.audioSystem.switchToTrack('intense_combat');
      
      // Cinematic moment
      this.babylonEngine.triggerSlowMotion();
    }
  }
  
  /**
   * Record player action
   */
  recordAction(action: PlayerAction): void {
    switch (action.type) {
      case 'kill':
        this.metrics.kills++;
        break;
      case 'death':
        this.metrics.deaths++;
        break;
      case 'coin_collect':
        this.metrics.coinsCollected += action.value;
        break;
      case 'achievement':
        this.metrics.achievementsUnlocked++;
        break;
      case 'chapter_complete':
        this.metrics.chaptersCompleted++;
        break;
      case 'boss_defeat':
        this.metrics.bossesDefeated++;
        break;
    }
    
    // Recalculate engagement after significant action
    if (['achievement', 'chapter_complete', 'boss_defeat'].includes(action.type)) {
      this.calculateEngagement();
    }
  }
  
  /**
   * Get engagement report
   */
  getEngagementReport(): EngagementReport {
    return {
      currentScore: this.engagementScore,
      metrics: this.metrics,
      recommendations: this.getRecommendations(),
      history: this.engagementHistory.slice(-10) // Last 10 snapshots
    };
  }
  
  /**
   * Get personalized recommendations
   */
  private getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.engagementScore < 50) {
      recommendations.push('Try easier difficulty setting');
      recommendations.push('Focus on collecting coins for upgrades');
      recommendations.push('Complete tutorial objectives first');
    }
    
    if (this.metrics.accuracy < 50) {
      recommendations.push('Practice aiming in training mode');
      recommendations.push('Upgrade weapon accuracy');
    }
    
    if (this.metrics.deaths > this.metrics.kills) {
      recommendations.push('Upgrade armor for more survivability');
      recommendations.push('Use cover and evasive maneuvers');
    }
    
    return recommendations;
  }
}

interface PlayerMetrics {
  playTime: number;
  kills: number;
  deaths: number;
  accuracy: number;
  coinsCollected: number;
  achievementsUnlocked: number;
  chaptersCompleted: number;
  bossesDefeated: number;
  lastSessionDuration: number;
  sessionsPlayed: number;
  averageSessionLength: number;
  longestStreak: number;
  currentStreak: number;
}

interface EngagementSnapshot {
  timestamp: number;
  score: number;
  factors: any;
}
```

## Integration

```typescript
// In BabylonEngine.ts
export class BabylonEngine {
  private storytellingSystem: StorytellingSystem;
  private engagementTracker: EngagementTracker;
  
  constructor() {
    // Initialize systems
    this.storytellingSystem = new StorytellingSystem(this);
    this.engagementTracker = new EngagementTracker(this);
  }
  
  // Start campaign mode
  startCampaign(): void {
    this.storytellingSystem.startChapter(0);
  }
  
  // Record player actions for engagement tracking
  onPlayerAction(action: PlayerAction): void {
    this.engagementTracker.recordAction(action);
  }
}
```

## Expected Results

### Player Engagement Metrics
- **Session Length**: 45-60 minutes (up from 15 minutes)
- **Return Rate**: 80%+ (D7 retention)
- **Satisfaction Score**: 95%+
- **Completion Rate**: 60%+ players complete at least 5 chapters

### Addictive Gameplay Loops
1. ✅ Story progression hooks players
2. ✅ Achievement hunting adds replayability
3. ✅ Dynamic difficulty keeps challenge optimal
4. ✅ Rewards system creates dopamine hits
5. ✅ Boss fights provide epic moments

**Status**: Ready for implementation
**Priority**: CRITICAL
**Estimated Time**: 3 weeks

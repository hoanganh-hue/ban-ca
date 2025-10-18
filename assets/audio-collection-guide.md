# 🎵 Audio Assets Collection Guide

## 🎯 Sound Effects Needed

### Weapon & Combat Sounds
- **Shooting Sounds**
  - `weapon_fire_underwater.wav` - Tiếng bắn dưới nước (muffled)
  - `weapon_reload.wav` - Tiếng nạp đạn
  - `weapon_charge.wav` - Tiếng sạc đạn (power-up weapon)
  
- **Impact & Hit Sounds**
  - `bullet_impact_fish.wav` - Tiếng đạn trúng cá
  - `explosion_underwater.wav` - Tiếng nổ dưới nước
  - `bubble_burst.wav` - Tiếng bong bóng vỡ

### Environment & Ambient
- **Water Sounds**
  - `water_ambient_loop.wav` - Tiếng nước ambient (loop)
  - `bubbles_rising.wav` - Tiếng bong bóng nổi lên
  - `water_movement.wav` - Tiếng nước chuyển động
  
- **Fish & Marine Life**
  - `fish_swimming.wav` - Tiếng cá bơi
  - `big_fish_appearance.wav` - Tiếng boss fish xuất hiện
  - `fish_death.wav` - Tiếng cá chết

### UI & Interface
- **Menu Sounds**
  - `button_click.wav` - Tiếng click button
  - `button_hover.wav` - Tiếng hover button
  - `menu_open.wav` - Tiếng mở menu
  - `menu_close.wav` - Tiếng đóng menu
  
- **Game Events**
  - `coin_collect.wav` - Tiếng nhận coin
  - `item_pickup.wav` - Tiếng nhận item
  - `level_complete.wav` - Tiếng hoàn thành level
  - `power_up_activate.wav` - Tiếng kích hoạt power-up

### Background Music
- **Main Themes**
  - `menu_theme.mp3` - Nhạc menu chính (loop)
  - `gameplay_theme.mp3` - Nhạc chơi game (loop)
  - `boss_battle_theme.mp3` - Nhạc boss battle
  - `victory_theme.mp3` - Nhạc thắng lợi

## 🔍 Free Audio Resources

### Sound Effects Libraries
1. **Freesound.org**
   - Search: "underwater shooting", "bubble", "water splash"
   - License: Creative Commons
   
2. **Zapsplat.com** 
   - Professional SFX library
   - Free tier available
   
3. **Adobe Audition CC**
   - Built-in sound effects
   - Underwater processing

### Music Sources
1. **Kevin MacLeod (incompetech.com)**
   - Royalty-free music
   - Ambient/electronic tracks
   
2. **YouTube Audio Library**
   - Free background music
   - Filter by mood: "ambient", "electronic"
   
3. **Bensound.com**
   - Creative Commons tracks
   - Suitable for games

## 🎧 Audio Processing Guidelines

### Technical Specifications
- **Format**: OGG Vorbis (web-optimized) + MP3 (fallback)
- **Sample Rate**: 44.1 kHz
- **Bit Rate**: 128 kbps (SFX), 192 kbps (Music)
- **Channels**: Mono (SFX), Stereo (Music)

### Underwater Processing
```
1. Low-pass filter (cut frequencies >3kHz)
2. Add reverb with long decay
3. Slight pitch down (-2 semitones)
4. Add subtle chorus/flanger
```

### File Organization
```
assets/audio/
├── sfx/
│   ├── weapons/         # Weapon sounds
│   ├── impacts/         # Hit/explosion sounds  
│   ├── environment/     # Water/bubble sounds
│   ├── creatures/       # Fish/marine sounds
│   └── ui/              # Interface sounds
└── music/
    ├── themes/          # Background music
    └── stingers/        # Short musical cues
```

## 🔊 Integration with Game Engine

### Web Audio API Integration
```typescript
// AudioManager class for game
class AudioManager {
  private context: AudioContext;
  private sounds: Map<string, AudioBuffer> = new Map();
  
  async loadSound(name: string, url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    this.sounds.set(name, audioBuffer);
  }
  
  playSound(name: string, volume: number = 1.0) {
    const buffer = this.sounds.get(name);
    if (buffer) {
      const source = this.context.createBufferSource();
      const gainNode = this.context.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(this.context.destination);
      source.start();
    }
  }
}
```

### Babylon.js Sound Integration
```typescript
// Import sounds in Babylon.js
const shootSound = new BABYLON.Sound(
  "shoot", 
  "assets/audio/sfx/weapons/weapon_fire_underwater.wav", 
  scene,
  null, 
  { volume: 0.5, spatialSound: true }
);

// Play sound when shooting
shootSound.play();
```

## 🏆 Priority Collection List

### High Priority (Must Have)
1. ✅ Weapon fire sound (underwater)
2. ✅ Fish hit/death sound 
3. ✅ Coin collect sound
4. ✅ Button click sound
5. ✅ Background water ambience

### Medium Priority (Should Have)
1. ▫ Explosion effects
2. ▫ Power-up activation
3. ▫ Menu music theme
4. ▫ Fish swimming sounds
5. ▫ Bubble effects

### Low Priority (Nice to Have)
1. ▫ Boss battle music
2. ▫ Victory fanfare
3. ▫ Advanced weapon sounds
4. ▫ Environmental variations

---
*Nên tập trung thu thập High Priority trước, sau đó mới mở rộng*
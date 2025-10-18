# 🔧 Asset Integration Guide

## Babylon.js Texture Loading

```typescript
// Water texture loading
const waterTexture = new BABYLON.Texture("assets/textures/water/seamless_ocean_water.jpg", scene);
waterTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
waterTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

// Sand material
const sandMaterial = new BABYLON.StandardMaterial("sand", scene);
sandMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/sand/seamless_sand.jpg", scene);
sandMaterial.bumpTexture = new BABYLON.Texture("assets/textures/sand/sand_normal.jpg", scene);
```

## React UI Integration

```tsx
// UI Button component
import buttonBg from '../assets/ui/buttons/underwater_ui_kit.jpg';

const GameButton: React.FC = () => {
  return (
    <div className="game-button" style={{backgroundImage: `url(${buttonBg})`}}>
      Play Game
    </div>
  );
};
```

## Particle System Setup

```typescript
// Bubble particle system
const bubbleSystem = new BABYLON.ParticleSystem("bubbles", 2000, scene);
bubbleSystem.particleTexture = new BABYLON.Texture("assets/effects/particles/underwater_bubbles.png", scene);
bubbleSystem.emitter = fountainProfile;
bubbleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0);
bubbleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0);
```

## Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/',
              publicPath: '/assets/',
            },
          },
        ],
      },
    ],
  },
};
```
# 🚂 Train Game - Vanilla JavaScript Game

A fun, interactive train game built with vanilla HTML, CSS, and JavaScript. Avoid obstacles and rack up points as fast as you can!

## 🎮 How to Play

### Controls
- **Move Left**: `← Arrow Key` or `A`
- **Move Right**: `→ Arrow Key` or `D`
- **Move Up**: `↑ Arrow Key` or `W`
- **Move Down**: `↓ Arrow Key` or `S`
- **Pause/Resume**: `Spacebar`

### Objective
- Guide your train across the game area to **avoid obstacles** (rocks and trees)
- Each obstacle you successfully avoid earns you **+10 points**
- Survive as long as possible without colliding with obstacles
- You have **3 lives** - lose them all and it's game over!

### Scoring System
- **Obstacle Avoided**: +10 points
- **Current Streak**: Track how many obstacles you avoid in a row
- **Max Streak**: Your best consecutive obstacle avoidance
- **Final Score**: Total points at end of game

## ✨ Features

✅ **Smooth Controls**: Arrow keys or WASD for responsive movement  
✅ **Collision Detection**: Accurate obstacle collision physics  
✅ **Progressive Difficulty**: Obstacle spawn rate increases as you score more  
✅ **Real-time Scoring**: Watch your score grow as you avoid obstacles  
✅ **Lives System**: 3 lives before game over  
✅ **Game Over Screen**: View final stats and restart easily  
✅ **Responsive Design**: Works great on desktop, tablet, and mobile  
✅ **Smooth Animations**: CSS animations and transitions for visual polish  
✅ **Pause Feature**: Press Space to pause/resume gameplay  
✅ **Clean Code**: Well-commented, educational-friendly JavaScript  

## 🚀 Getting Started

### Installation
No installation required! Just open the game in your web browser:

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Click "Start Game" to begin

```bash
# Clone the repository (if applicable)
git clone <repository-url>
cd train-game

# Simply open index.html in your browser
# No build process, no dependencies!
```

### Browser Compatibility
Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Game Mechanics

### Train
- The red train at the bottom of the screen is your player character
- Move it smoothly to avoid incoming obstacles
- The train is constrained to the game boundaries
- Movement is momentum-based for smooth control

### Obstacles
- **Rocks** (🪨) and **Trees** (🌲) fall from the top
- Each obstacle moves at a random speed (4-6 pixels per frame)
- Colliding with an obstacle costs you 1 life
- Successfully avoiding an obstacle adds 10 points
- Obstacles spawn faster as you score more (progressive difficulty)

### Levels & Difficulty
- Game starts at Level 1 with obstacles spawning every 0.8 seconds
- Spawn rate increases by 5% for each level
- Minimum spawn rate caps at 0.5 seconds (cannot spawn too fast)
- Adapt your strategy as the game gets harder!

### Game Over
- Game ends when you lose all 3 lives
- Final stats displayed: Score, Obstacles Avoided, Max Streak
- Click "Play Again" to restart

## 📊 Game Statistics

After each game, you'll see:
- **Final Score**: Total points earned
- **Total Obstacles Avoided**: Count of safely dodged obstacles
- **Max Streak**: Your longest consecutive avoided obstacles

## 🎨 Visual Design

- **Color Scheme**: Purple gradient background with sky-blue game area
- **Train**: Red with a window and wheels
- **Obstacles**: Gray rocks and green trees with emoji icons
- **UI**: Clean, modern interface with smooth animations
- **Responsive**: Adapts beautifully to any screen size

## 💻 Technical Details

### Built With
- **HTML5**: Semantic markup and structure
- **CSS3**: Styling, animations, and responsive design
- **Vanilla JavaScript**: Game logic, collision detection, game loop

### File Structure
```
train-game/
├── index.html      # Main HTML file with game structure
├── style.css       # All styling and responsive design
├── script.js       # Game logic and mechanics
└── README.md       # This file
```

### Performance
- **60 FPS** smooth gameplay using `requestAnimationFrame`
- **Optimized Collision Detection**: Efficient bounding-box algorithm
- **Memory Efficient**: Obstacles removed when off-screen
- **No External Dependencies**: Pure vanilla JavaScript

### Game Loop
The game uses a single game loop at 60FPS that:
1. Handles player input (keyboard controls)
2. Updates train position
3. Spawns obstacles at intervals
4. Updates obstacle positions
5. Checks for collisions
6. Renders everything to screen

## 🛠️ Code Architecture

### Key Components

**Game State**
- Tracks score, lives, game status, and difficulty level
- Single source of truth for game data

**Train Object**
- Player character with position, velocity, and boundary constraints
- Methods for update and render

**Obstacle Class**
- Represents each falling obstacle
- Handles creation, update, rendering, and removal

**Collision Detection**
- Bounding-box algorithm for accurate hit detection
- Triggers game over when collision detected

**Keyboard Input**
- Event listeners for smooth, responsive control
- Tracks multiple keys for simultaneous movement

## 🎓 Educational Notes

This game is great for learning:
- **Game Development Concepts**: Game loops, collision detection, state management
- **JavaScript Patterns**: Object-oriented design, event handling, DOM manipulation
- **CSS Animations**: Keyframe animations, transitions, responsive design
- **Performance**: Using `requestAnimationFrame` for smooth animation

## 🐛 Known Limitations

- Currently single-player only
- No sound effects (can be added!)
- No high-score persistence (could add localStorage)
- No alternative game modes (yet!)

## 🚀 Future Enhancements

Potential features to add:
- Sound effects and background music
- Power-ups (speed boost, shield, slow-mo)
- Different game modes (Time Attack, Survival, etc.)
- High-score leaderboard with localStorage
- Mobile touch controls
- Particle effects on collision
- Multiple train skins/themes
- AI opponents

## 📝 Tips for Playing

1. **Start Slow**: Get comfortable with controls before things get hectic
2. **Watch Ahead**: Try to predict where obstacles will be
3. **Use the Edges**: The screen edges are your friends for quick dodges
4. **Smooth Movements**: Hold keys for continuous movement, don't tap frantically
5. **Stay Centered**: The middle gives you the most escape options
6. **Practice**: Muscle memory helps - the more you play, the better you'll get!

## 🤝 Contributing

Feel free to fork, modify, and improve this game! Some ideas:
- Add new obstacle types
- Create different game themes
- Implement power-ups
- Add sound effects
- Create mobile-optimized controls

## 📄 License

This project is open source and available for educational and personal use.

## 🎉 Have Fun!

Enjoy the game and challenge yourself to beat your high score! 🚂💨

---

**Made with ❤️ for fun and learning**
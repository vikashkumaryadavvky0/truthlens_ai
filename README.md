# Little Locomotive

A cheerful, browser-based train dodging game made with vanilla HTML, CSS, and JavaScript. Pick a world, then steer through its themed scenery. No install or build step is needed.

## Play

Open `index.html` in a modern browser. It takes you to the game. You can also open `game.html` directly.

### Controls

- **Move:** Arrow keys or WASD
- **Pause / resume:** `P` or `Space`, or the pause button
- **Touch screens:** Hold the on-screen direction buttons
- **Sound:** Toggle on or off using the sound button
- **Choose a theme:** Use the palette button before play or while paused

### How it works

Steer the train around falling rocks and trees. Collect glowing stars for 100 points and a temporary shield. Clear hazards to earn points, and keep going as the track gradually gets faster. The ride ends after three collisions without a shield. Open the theme picker at any time; choosing during a run pauses the game until you resume.

## Worlds

- **Sunny Meadow** - green hills, flowers, and a cheerful red locomotive
- **Frosty Peaks** - snowy scenery, icy rails, and a blue engine
- **Golden Sunset** - warm desert skies, cacti, and copper-colored tracks
- **Neon Night** - violet night scenery, glowing rails, and an electric-aqua train

The selected world is saved locally, so it remains selected the next time you play.

Your best score and sound preference are saved locally in your browser. Sound effects are synthesized with the Web Audio API; there are no audio or image downloads.

## Features

- Responsive canvas art with a scrolling railway, scenery, locomotive, hazards, and effects
- Four selectable worlds that recolor both the game interface and its illustrated canvas scene
- Keyboard and touch controls, plus pause/resume
- Collectible stars, temporary shields, collision protection, score streaks, and route progression
- Optional synthesized sound effects
- Locally saved best score and sound preference
- Reduced-motion styling and accessible control labels

## Files

- `index.html` - Entry page
- `game.html` - Game interface, theme picker, and canvas
- `style.css` - Responsive layout, overlays, and controls
- `script.js` - Game loop, drawing, controls, collisions, and scoring

The game is frontend-only and works without a server or third-party runtime dependencies. An internet connection is only used for optional Google Fonts; system font fallbacks are included.

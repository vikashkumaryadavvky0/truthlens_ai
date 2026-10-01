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

- **Sunny Meadow** - rolling green hills, a winding stream, wildflowers, a spinning windmill, and a cheerful red locomotive
- **Frosty Peaks** - layered snow-capped mountains, falling snow, frosted pines, icy rails, and a blue engine
- **Golden Sunset** - desert mesas, a warm amber sky, cacti, copper tracks, and a sunset-colored engine
- **Neon Night** - a violet starfield, glowing city skyline and rails, and an electric-aqua train

Every world is a hand-drawn canvas adventure with its own landscape, atmosphere, track colors, train livery, and interface accents. Choose one from the palette button or the start screen; your selection is saved locally, so it remains selected the next time you play.

Your best score and sound preference are saved locally in your browser. Sound effects are synthesized with the Web Audio API; there are no audio or image downloads.

## Changing weather

Every journey begins in clear weather. Conditions shift dynamically as you travel, with short clear spells between weather events:

- **Rain** draws slanting drops over the route, reduces steering acceleration, and increases stopping distance on slick rails.
- **Snow** adds drifting flakes and substantially reduces grip, steering response, and braking power.
- **Fog** washes over the scene to shorten track visibility, while leaving the train and nearby objects visible.
- **Thunderstorms** combine heavy rain, sideways gusts, slower braking, and occasional lightning.

The weather badge and message below the canvas identify current conditions and their driving effect. In poor conditions, release the movement key early or steer against your momentum to brake; stopping distance is longer on wet and snowy rails.

## Features

- Responsive canvas art with a scrolling railway, scenery, locomotive, hazards, and effects
- Four selectable worlds that recolor both the game interface and its illustrated canvas scene
- Keyboard and touch controls, plus pause/resume
- Collectible stars, temporary shields, collision protection, score streaks, and route progression
- Dynamic weather transitions between clear skies, rain, snow, fog, and thunderstorms
- Weather effects with changing visibility, steering grip, momentum, braking distance, storm gusts, and lightning
- Optional synthesized sound effects
- Locally saved best score and sound preference
- Reduced-motion styling and accessible control labels

## Files

- `index.html` - Entry page
- `game.html` - Game interface, theme picker, and canvas
- `style.css` - Responsive layout, overlays, and controls
- `script.js` - Game loop, drawing, controls, collisions, and scoring

The game is frontend-only and works without a server or third-party runtime dependencies. An internet connection is only used for optional Google Fonts; system font fallbacks are included.

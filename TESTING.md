# Manual verification

The game has no build step or automated test suite. Verify it in a modern browser by opening `index.html` or `game.html`.

## Browser checks

- The entry page opens the game and the start overlay is visible.
- Starting a journey hides the overlay, draws the train, and the score increases while the game runs.
- Arrow keys and WASD steer the train in all directions without letting it leave the route.
- Pressing `P` or `Space` pauses the score and shows the pause overlay; resume continues play.
- Stars increase the score and activate a timed shield. Rocks and trees consume a life unless the shield is active.
- After three unshielded collisions the game-over overlay shows the result and can restart the game.
- The sound control toggles synthesized effects, and the touch direction buttons steer while held.
- The saved personal best survives a page reload.
- Open the theme picker before play; select Sunny Meadow, Frosty Peaks, Golden Sunset, or Neon Night and verify the locomotive, sky, ground, track, and interface change.
- Verify the world landmarks are distinct: the meadow stream and windmill, snowy mountain peaks and snow-topped trees, desert mesas and cacti, or neon city skyline and starfield.
- Change theme during a run; gameplay should pause safely and retain the current run when resuming.
- The selected world remains selected after reloading.
- Start a journey and wait through the weather cycle; the HUD should transition from clear skies through rain, snow, fog, and thunderstorms with clear intervals.
- Verify rain and storms render rain streaks, snow renders drifting flakes, fog veils the distant route, and thunderstorms occasionally flash lightning.
- Compare steering and braking in clear weather with rain, snow, and storms: adverse weather should produce slower response and longer stopping distances; storms should also nudge the train sideways.
- The weather badge and driving note should update at each transition and show the active condition.
- At narrow viewport widths the game, HUD, and touch controls remain visible and usable.

## Verified during implementation

- Browser loaded the entry page and rendered the game canvas and start screen.
- Starting the game hid the start screen and advanced the score.
- Keyboard pause stopped score progression; resume restarted it.
- Simulated right-arrow input moved the train sprite to the right.
- The touch direction controls were present in the page.
- Selected each theme and confirmed the canvas colors, theme label, active-button state, and saved preference changed.
- Confirmed that sampled canvas colors differ between all four themes and that the selected theme persisted after a page reload.
- Changed themes during a run; the run paused, retained its state, and resumed successfully.
- Weather visual effects and weather-dependent steering/braking were added to the game loop.
- Browser run advanced automatically from clear skies to rain, updating both the weather badge and the wet-track handling note.
- During rain, pausing froze score and weather transitions; resuming restarted both.

Star collection, shield protection, sound playback, and small-screen behavior should also be tried in a browser as part of manual playtesting.

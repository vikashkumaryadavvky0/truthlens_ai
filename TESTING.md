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
- At narrow viewport widths the game, HUD, and touch controls remain visible and usable.

## Verified during implementation

- Browser loaded the entry page and rendered the game canvas and start screen.
- Starting the game hid the start screen and advanced the score.
- Keyboard pause stopped score progression; resume restarted it.
- Simulated right-arrow input moved the train sprite to the right.
- The touch direction controls were present in the page.

Star collection, shield protection, sound playback, and small-screen behavior should also be tried in a browser as part of manual playtesting.

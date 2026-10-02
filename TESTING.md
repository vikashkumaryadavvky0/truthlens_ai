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
- Select **Dispatcher Crew** and confirm the start button, role instructions, and selected-mode styling update; Solo Run should remain the default and keep its original controls.
- Start Dispatcher Crew: the signal console should appear with a countdown, branch tracks/signals should render, and an approaching traffic train should display its destination.
- In the default roles, WASD should steer the player train while Left/Right changes the approaching train's Track A/B route; click the matching signal button to verify it also routes successfully.
- Route several trains correctly and verify each awards 100 points; choose the wrong track or let the deadline pass and verify one heart is deducted, without repeatedly losing hearts from the same missed train.
- Steer into dispatched traffic and verify a single conflict costs one heart; continue to game over and confirm Dispatcher Crew results show trains routed and missed schedules.
- Swap roles while playing and confirm the driver uses arrow keys, the dispatcher uses A/D, the on-screen key hints change, and signal-button controls still work.
- Pause during an approaching train and verify its position, dispatch deadline, score, and weather freeze; resume and confirm they continue.
- Restart in Crew mode and confirm dispatch counters, traffic, role assignment, and route state reset; switch back to Solo Run and confirm no dispatch UI or branch traffic remains.
- At a narrow viewport, verify the Dispatcher Crew console and both signal buttons remain visible and usable.
- Select **Career & Story** and confirm three story missions appear with later chapters locked, mission briefing, point target, timetable, and speed cap.
- Start the first story mission and verify the mission HUD counts down, tracks point-target and safe-hazard progress, reports train speed, and shows the strict cap.
- Drive normally and confirm speed stays at or below the posted cap; hold Shift to exceed it and verify the speeding indicator/achievement warning appears.
- Clear the required hazards and reach the target before the deadline without speeding or losing hearts; verify the achievement is awarded, the next mission unlocks, and the result button returns to the campaign with the next chapter selected.
- Complete a mission after a collision or speed-limit violation and verify it does not earn the achievement or unlock the next chapter; retry the same mission.
- Allow a mission's timetable to expire and confirm a failure report and retry option; pause/resume and verify the timer stops/continues correctly.
- Reload the page after unlocking a chapter and verify completed achievements and unlocked missions persist; ensure Crew and Solo modes still hide the career panel.
- At a narrow viewport, verify the mission picker and career HUD fit without horizontal overflow.

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
- Dispatcher Crew routed a scheduled Track A train for +100 points, swapped dispatcher controls to A/D, and correctly charged exactly one heart for a controlled train conflict.
- Crew mode kept its signal desk visible and career panel hidden; the default Solo Run started with both mode-specific panels hidden.
- Career mode displayed its locked mission list and live timetable; the first mission held normal driving to 42 mph, while Shift produced a speeding warning.
- A clean simulated arrival reaching 280 points and clearing at least 3 hazards earned the first achievement, unlocked and selected Alpine Express, and retained the achievement/unlock after a page reload.
- Reaching the point target without clearing any hazards expired the timetable and left the next chapter locked.
- A speeding mission finish did not grant the achievement or unlock the next chapter; pausing froze the career timer.

Star collection, shield protection, sound playback, and small-screen behavior should also be tried in a browser as part of manual playtesting.

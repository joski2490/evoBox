# evoBox Changelog

## v0.4.0 (March 15th)

### Features
- Improved creature name generation
- Last names now stay with children
- Added border to sandbox
- Smooth entity movement
- Added mode to have sandbox width = screen width
- Creatures now have random colo(u)rs
- Creatures size is now scaling with their mass / food
- Added watermark
- Added reset / restart button
- Made top bar larger on larger displays
- Added new logo

### Changes
- Removed version from title
- Food is now green instead of red
- Updated meta / description tags

### Fixes
- Force UI updates on entities when zooming (fixes nothing happening when paused and changing zoom)
- Disable pointer cursor for food
- Fixed creature removal event reporting the 'removeFood' event instead of the 'removeCreature' event

## v0.3.0 (March 12th)

### Features
- Add to log when creature reproduces
- Added zooming, panning and relative space
- Added Unicode / emojis to things in top bar
- Added partices for mutating, reproducing and dying
- Added window popup when clicking creatures including information

### Fixes
- Fixed some symbol fonts incorrectly rendering the time symbols
- Readded age death for creatures


## v0.2.0 (March 9th)

### Features
- Enhanced creature's food choices
- When there's more than one line in the log, now fade out the older lines instead of just removing them

### Changes
- Decreased natural food quality degrade rate
- Moved dead checks to end of updates (creatures + food)
- Stopped creature's not going to food if another creature is targetting it as all creature's targets would be unknown to a single creature

### Fixes
- Fixed that food would not run update callbacks
- Fixed food having negative values and not being destroyed
- Fixed food value still working with negative quality
- Fixed creature eating being inaccurate and unstable
- Fixed food spawning rates being inverse for speeds (fast speed = slower rate, slow speed = faster rate)
- Fixed natural food quality degrade using old speed factor function


## v0.1.0 (March 8th)
Initial release.
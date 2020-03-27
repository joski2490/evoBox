# evoBox Changelog

### v1.0.0-RC2 (March 27th)

### Changes
- Upped frame rate lock to 60 (from 30)
- Decreased total background cells to 300 (from 500)


## v1.0.0 (March 26th)

### Features
- **Added diseases**
- Pressing 'r' now restarts the world
- Zooming with shortcuts Ctrl + key now zooms the sandbox instead of the actual page
- **Added coloring to log messages**
- Can now pan around by scrolling
- **New renderer using canvas, a lot more performant and uses less resources**
- Updated panning border restriction to be smoother
- **Added new random multicolor moving background**
- Updated some styling of the UI

### Changes
- Auto exit full zoom mode on attempt to change zoom
- Unmade dead creatures degrade
- Made controls window's width is smaller

### Fixes
- Fixed creatures able to mate with dead creatures
- Fixed children not having genes after mating
- Fixed children from asexual reproduction's genes being linked to their parent (if either change, they both change)


## v0.5.0 (March 19th)

### Features
- Double click anywhere in sandbox to add food
- Added controls window
- Added fadein and fadeout animations to windows
- Food and age of dead creatures continue to change
- Added dead attribute to creature window

### Changes
- Made windows more transparent

### Fixes
- Fixed windows being able to be dragged from their body, only header


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
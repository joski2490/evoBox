# evoBox Changelog

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
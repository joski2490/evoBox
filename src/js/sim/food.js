import * as Util from './util';

export default class Food {
  constructor(world, quantity, quality, x, y) {
    this.world = world;

    this.name = Util.randomChars();

    this.quantity = quantity || Util.getRandomInt(1, 101);
    this.quality = quality || Util.getRandomInt(1, 101);

    this.x = x || Util.getRandomInt(-100, 101);
    this.y = y || Util.getRandomInt(-100, 101);

    this.age = 0;

    this.eventCallback = function() {};

    this.destroyed = false;
  }

  update() {
    this.quality -= 0.2 * this.world.speed;

    setTimeout(function() { this.eventCallback('update', this); }.bind(this), 1);

    if (this.value() <= 0) {
      this.destroy();
      return;
    }
  }

  value() {
    if (this.quality <= 0) { return -1; }

    return this.quantity / 100 * (this.quality + 50);
  }

  destroy() {
    this.eventCallback('destroy', this);

    this.world.removeFood(this);

    this.destroyed = true;
  }
}

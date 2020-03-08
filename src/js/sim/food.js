import * as Util from './util';

export default class Food {
  constructor(world, quantity, quality, x, y) {
    this.world = world;

    this.name = Util.randomName();

    this.quantity = quantity || Util.getRandomInt(1, 101);
    this.quality = quality || Util.getRandomInt(1, 101);

    this.x = x || Util.getRandomInt(-100, 101);
    this.y = y || Util.getRandomInt(-100, 101);

    this.age = 0;

    this.eventCallback = function() {};
  }

  update() {
    if (this.value() <= 0) {
      this.destroy();
      return;
    }

    if (this.age === 0) {
      this.eventCallback('create', this);
    }

    let speedFactor = Util.speedFactor(this.world.speed);

    this.quality -= 0.25 * speedFactor;
    this.age += 0.25 * speedFactor;
  }

  value() {
    return this.quantity / 100 * (this.quality + 50);
  }

  destroy() {
    this.eventCallback('destroy', this);

    this.world.removeFood(this);
  }
}
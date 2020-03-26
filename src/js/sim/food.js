import * as Util from './util';
import Thing from './thing';

export default class Food extends Thing {
  constructor(world, quantity, quality, x, y) {
    super(world, x, y, 'food');

    this.name = Util.randomChars();

    this.quantity = quantity || Util.getRandomInt(1, 101);
    this.quality = quality || Util.getRandomInt(1, 101);
  }

  update() {
    this.quality -= 0.2 * this.world.speed;

    setTimeout(function() { this.eventCallback('update', this); }.bind(this), 1);

    this.infections.forEach((x) => x.run(this));

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

import * as Util from './util';

export default class Thing {
  constructor(world, x, y, type) {
    this.world = world;
    
    this.x = x || Util.getRandomInt(-100, 101);
    this.y = y || Util.getRandomInt(-100, 101);

    this.age = 0;

    this.infections = [];

    this.dead = false;
    this.destroyed = false;

    this.eventCallback = function() {};

    this.efficiency = {
      immune: 100
    };

    this.immunity = {};

    this.type = type || 'thing';
  }

  update() {

  }


  value() {
    
  }

  destroy() {

  }
}
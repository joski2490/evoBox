import Food from './food';
import Creature from './creature';
import { UIWorld } from '../ui/main';
import * as Util from './util';

function showNumber(n) {
  return parseFloat(n.toPrecision(3));
}

export default class World {
  constructor(food, creatures) {
    this.food = food || [];
    this.creatures = creatures || [];

    //this.updateInterval = setInterval(this.update.bind(this), 100);

    this.eventCallback = function() {};

    this.updateTimes = [];
    this.updates = 0;
    this.ups = 0;
    this.lastAddedFood = 0;
    this.paused = false;
    this.speed = 1;
    this.elapsedTime = 0;

    setTimeout(this.update.bind(this), 100);
    setInterval(function() { this.ups = this.updates; this.updates = 0; }.bind(this), 1000);
  }

  update() {
    let speedFactor = Util.speedFactor(this.speed);
    speedFactor = 1;

    let updateBetween = 50;
    let updateSpeed = updateBetween * speedFactor;

    if (this.paused) {
      setTimeout(this.update.bind(this), updateSpeed);

      this.eventCallback('update', this);

      return;
    }

    let startTime = performance.now();

    for (let c of this.creatures) {
      c.update();
    }

    for (let f of this.food) {
      f.update();
    }

    if (this.creatures.length === 0 || this.creatures.filter((c) => !c.dead).length === 0) {
      for (let i = 0; i < 5; i++) {
        this.addCreature(new Creature(this, undefined));
      }
    }

    if (this.food.length < 50 && performance.now() - this.lastAddedFood > 500 * this.speed) {
      this.addFood(new Food(this));
      this.lastAddedFood = performance.now();
    }

    let diff = performance.now() - startTime;

    this.updateTimes.push(diff);

    if (this.updateTimes.length > 50) {
      this.updateTimes.shift();
    }

    let generations = this.creatures.map((c) => c.generation);
    generations = generations.sort((a, b) => a - b);

    let genHalf = Math.floor(generations.length / 2);
    let genMedian = 0;
    if (generations.length % 2) {
      genMedian = generations[genHalf];
    } else {
      genMedian = (generations[genHalf - 1] + generations[genHalf]) / 2.0;
    }

    document.getElementById('debug').innerText = `Current: ${showNumber(diff)}ms
Average: ${showNumber(this.updateTimes.reduce((p, c) => c += p) / this.updateTimes.length)}ms
Min: ${showNumber(Math.min(...this.updateTimes))}ms
Max: ${showNumber(Math.max(...this.updateTimes))}ms
Time between: ${showNumber(updateSpeed)}ms
Compensated: ${showNumber(updateSpeed - diff)}ms

UPS: ${this.ups}

Entities: ${this.creatures.length + this.food.length}
Food: ${this.food.length}

Creatures: ${this.creatures.length} - ${this.creatures.filter((c) => c.dead).length} dead
Median Gen: ${showNumber(generations.reduce((p, c) => c += p) / generations.length)}
Max Gen: ${Math.max(...generations)}`;

    diff = performance.now() - startTime;

    setTimeout(this.update.bind(this), updateSpeed - diff);

    this.updates++;

    this.elapsedTime += (updateSpeed - diff) * this.speed;

    this.eventCallback('update', this);
  }

  addFood(food) {
    this.food.push(food);

    this.eventCallback('addFood', food);
  }

  removeFood(food) {
    this.food.splice(this.food.indexOf(food), 1);

    this.eventCallback('removeFood', food);
  }

  addCreature(creature) {
    this.creatures.push(creature);

    this.eventCallback('addCreature', creature);
  }

  removeCreature(creature) {
    this.creatures.splice(this.creatures.indexOf(creature), 1);

    this.eventCallback('removeFood', creature);
  }

  inWorld(object) {
    return this.creatures.includes(object) || this.food.includes(object);
  }
}

window._world = new World();
UIWorld(window._world);

/*
TODO:
- dynamic ms / ups compensating with lag
- show time between updates wanted + actual
*/
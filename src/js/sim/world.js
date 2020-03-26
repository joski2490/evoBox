import Food from './food';
import Creature from './creature';

import Disease from './disease';
import * as TransmissionMethod from './types/transmissionMethod';

import { UIWorld } from '../ui/main';
import * as UIUtil from '/js/ui/util';


export default class World {
  constructor(food, creatures) {
    this.food = food || [];
    this.creatures = creatures || [];
    this.diseases = [];

    //this.updateInterval = setInterval(this.update.bind(this), 100);

    this.eventCallback = function() {};

    this.updateTimes = [];
    this.updates = 0;
    this.ups = 0;
    this.lastAddedFood = 0;
    this.paused = false;
    this.speed = 1;
    this.elapsedTime = 0;

    this.updateBetween = 100;

    this.options = {};

    setTimeout(this.update.bind(this), 100);

    setInterval(function() { this.ups = this.updates; this.updates = 0; }.bind(this), 1000);
  }

  update() {
    if (this.paused) {
      setTimeout(this.update.bind(this), this.updateBetween);

      this.eventCallback('update', this);

      return;
    }

    let startTime = performance.now();

    for (let c of this.creatures) {
      c.update();
    }

    let timeCreatureUpdate = performance.now() - startTime;

    for (var i = this.food.length - 1; i >= 0; i--) {
      this.food[i].update();
    }

    /*for (let f of this.food) {
      f.update();
    }*/

    let timeFoodUpdate = performance.now() - startTime;

    if (this.creatures.length === 0 || this.creatures.filter((c) => !c.dead).length === 0) {
      for (let i = 0; i < 5; i++) {
        this.addCreature(new Creature(this, undefined));
      }
    }

    if (this.food.length < 20 && performance.now() - this.lastAddedFood > 500 / this.speed) {
      this.addFood(new Food(this));
      this.lastAddedFood = performance.now();
    }

    if (Math.random() < 0.01 && this.elapsedTime > 1) {
      let d = new Disease();
      this.diseases.push(d);

      let o = d.infectRandom(this);

      UIUtil.addLog(`New disease outbreak: ${d.name} - Patient Zero: ${o.name} (${o.type})`, 'bad');
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

    try {
    document.getElementById('debug').innerText = `Current: ${UIUtil.showNumber(diff)}ms
Average: ${UIUtil.showNumber(this.updateTimes.reduce((p, c) => c += p) / this.updateTimes.length)}ms
Min: ${UIUtil.showNumber(Math.min(...this.updateTimes))}ms
Max: ${UIUtil.showNumber(Math.max(...this.updateTimes))}ms
Time between: ${UIUtil.showNumber(this.updateBetween)}ms
Compensated: ${UIUtil.showNumber(this.updateBetween - diff)}ms

Creature: ${UIUtil.showNumber(timeCreatureUpdate)}ms
Food: ${UIUtil.showNumber(timeFoodUpdate)}ms

UPS: ${this.ups}

Entities: ${this.creatures.length + this.food.length}
Food: ${this.food.length}

Creatures: ${this.creatures.length} - ${this.creatures.filter((c) => c.dead).length} dead
Median Gen: ${genMedian}
Max Gen: ${Math.max(...generations)}`;
    } catch (e) { console.error(e); }

    diff = performance.now() - startTime;

    setTimeout(this.update.bind(this), this.updateBetween - diff);

    this.updates++;

    this.elapsedTime += this.updateBetween * this.speed;

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

    this.eventCallback('removeCreature', creature);
  }

  inWorld(object) {
    return this.creatures.includes(object) || this.food.includes(object);
  }

  restart() {
    for (let c of [...this.creatures]) {
      c.destroy();
      this.removeCreature(c);
    }

    for (let f of [...this.food]) {
      f.destroy();
      this.removeFood(f);
    }

    this.elapsedTime = 0;
    this.lastAddedFood = 0;
  }
}

window._world = new World();
UIWorld(window._world);
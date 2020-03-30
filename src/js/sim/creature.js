import Thing from './thing';

import * as Sex from './types/sex';
import * as ReproductionMethod from './types/reproductionMethod';

import Food from './food';
import Vector from './vector';

import * as Util from './util';

function deepCloneGenes(genes) {
  let r = new Map();

  console.error(genes);

  for (let [k, v] of genes) {
    r.set(k, v);
  }

  console.warn(r);

  return r;
}

export default class Creature extends Thing {
  constructor(world, genes, name, food, x, y) {
    super(world, x, y, 'creature');

    this.genes = genes || Util.randomGenes();
    this.name = name || Util.randomName();

    this.food = food || 100;
    this.health = 100;

    this.reproductionMethod = ReproductionMethod.mating; //Util.getRandom(ReproductionMethod);
    this.sex = this.reproductionMethod === ReproductionMethod.asexual ? Sex.none : Util.randomSex();

    this.lastReproduction = 0;
    this.lookingForMate = false;

    this.target = undefined;

    this.generation = 0;

    this.efficiency = {
      eating: 100,
      immune: 100,
      movement: 100
    };
  }

  reproduce(mate) {
    let child = undefined;
    let name = Util.randomHalfName() + ' ' + this.name.split(' ')[1];
    let foodToGive = this.food / 100 * this.genes.get('reproduceFoodGiven').num;

    if (foodToGive < 50 || this.food - foodToGive < 50) {
      return false;
    }

    switch (this.reproductionMethod) {
      case ReproductionMethod.asexual:
        child = new Creature(this.world, deepCloneGenes(this.genes), name, foodToGive, this.x, this.y);

        break;

      default:
        let childGenes = new Map();

        let keys = [...new Set([...this.genes.keys(),...mate.genes.keys()])].sort();
        keys.forEach(key => {
            if (Math.random() >= 0.5) {
                childGenes.set(key, this.genes.get(key));
            } else {
                childGenes.set(key, mate.genes.get(key));
            }
        });

        child = new Creature(this.world, childGenes, name, foodToGive, this.x, this.y);
    }

    child.generation = this.generation + 1;

    this.food -= foodToGive;

    this.eventCallback('reproduce', {creature: this, child});

    this.world.addCreature(child);

    return child;
  }

  mutate() {
    let arr = Array.from(this.genes.keys());
    let r = this.genes.get(arr[Util.getRandomInt(0, arr.length)]).mutate();

    this.eventCallback('mutate', {creature: this, gene: r});

    return r;
  }

  die() {
    this.dead = true;

    this.eventCallback('die', this);
  }

  destroy() {
    this.eventCallback('destroy', this);

    this.world.removeCreature(this);

    this.destroyed = true;
  }

  eat(food) {
    if (food.value() <= 0) {
      food.destroy();
      return false;
    }

    // console.log(food, food.value(), food.quantity, food.value() / (food.quantity / 10));

    let speed = 15 / 100 * this.genes.get('eatingSpeed').num * this.world.speed;
    speed = speed / 100 * this.efficiency.eating;

    if (food.food === undefined) {
      this.food += speed * ((food.quality + 50) / 100);
      food.quantity -= speed;
    } else {
      this.food += food.value() / (food.food / speed);
      food.food -= speed;

      if (food.food < 0) {
        food.destroy();
      }
    }

    food.update();

    this.eventCallback('eat', {creature: this, food});
  }

  move(target) {
    if (target === undefined || target.destroyed === true) { this.target = undefined; return; }

    let distance = Util.distance(this, target);

    if (distance < 5) {
      this.target = undefined;
      return true;
    }

    let speed = 0.01 * (this.genes.get('movingSpeed').num + 50 - (this.food / 100)) * this.world.speed;
    speed = speed / 10 / this.world.ups * this.efficiency.movement;

    // console.log(speed);

    this.food -= speed / 15;

    let tooCloseCreatures = this.world.creatures.filter((c) => c !== this && Util.distance(this, c) < 50);

    if (tooCloseCreatures.length > 0) {
      let final = new Vector(0, 0);

      for (let c of tooCloseCreatures) {
        let diff = new Vector(this.x - c.x, this.y - c.y);

        diff.normalise();

        final.add(diff);
      }

      final.divide(tooCloseCreatures.length);
      final.normalise();

      this.x += final.x * 0.1;
      this.y += final.y * 0.1;
    }

    let dx = target.x - this.x;
    let dy = target.y - this.y;

    let length = Math.sqrt(dx * dx + dy * dy)
    dx = dx / length;
    dy = dy / length;

    let angle = Math.atan(dy, dx);

    let magnitude = speed;
    let velX = dx /*Math.cos(angle)*/ * magnitude;
    let velY = dy /*Math.sin(angle)*/ * magnitude;

    this.x += velX;
    this.y += velY;

    /*this.x = Util.lerp(this.x, target.x, speed / 50);
    this.y = Util.lerp(this.y, target.y, speed / 50);*/

    return false;
  }

  value() {
    return this.food * 0.75 + 20;
  }

  update() {
    if (this.dead) { // If dead, do nothing
      this.lookingForMate = false;
      this.target = undefined;

      this.eventCallback('update', this);

      return false;
    }

    this.age += (this.genes.get('ageDegrade').num / 200) / this.world.ups * this.world.speed;

    this.food -= (this.genes.get('hungerDegrade').num / 5) / this.world.ups * this.world.speed;

    if (Math.random() < (this.genes.get('mutateChance').num / 10000 / this.world.ups) * this.world.speed) { // Check if should mutate
      this.mutate();
    }

    if (this.food > this.genes.get('reproduceFoodNeeded').num * 5 && this.age > this.genes.get('reproductionAgeNeeded').num / 4 && this.age > this.lastReproduction + (this.genes.get('reproductionCooldown').num / 10)) { // Reproduce
      if (this.reproductionMethod === ReproductionMethod.asexual) {
        this.reproduce();

        this.lastReproduction = this.age;
      } else {
        let wantedSex = this.sex === Sex.male ? Sex.female : Sex.male;

        let nearbyMates = this.world.creatures.filter((c) => c.reproductionMethod === ReproductionMethod.mating && c.lookingForMate === true && c.sex === wantedSex && c !== this).sort((a, b) => Util.distance(this, a) - Util.distance(this, b));

        this.lookingForMate = true;

        if (nearbyMates.length > 0) {
          if (Util.distance(this, nearbyMates[0]) < 10) {
            this.reproduce(nearbyMates[0]);

            this.target = undefined;
            this.lookingForMate = false;
            this.lastReproduction = this.age;
          } else {
            this.target = nearbyMates[0];
          }
        }
      }
    } else {
      this.lookingForMate = false;
    }

    let food = this.world.food.concat(this.world.creatures.filter((c) => c.dead)).sort((a, b) => Util.distance(this, a) - Util.distance(this, b));
    let nearbyFood = food.filter((f) => Util.distance(this, f) < 5); // Eat nearby food

    if (nearbyFood.length > 0) {
      this.eat(nearbyFood[0]);
    } else { // Goto nearby food
      let sortFunc = (f) => f.value() - Math.pow(Util.distance(this, f));

      let goodFood = food.sort((a, b) => sortFunc(a) - sortFunc(b));

      let targets = [];
      for (let c of this.world.creatures.filter((c) => c !== this)) {
        targets.push(c.target);
      }

      // goodFood = goodFood.filter((f) => !targets.includes(f));

      this.target = !(this.lookingForMate && this.target) ? goodFood[0] : this.target;
    }

    this.move(this.target);

    this.infections.forEach((x) => x.run(this));

    if (this.food <= 0) {
      this.die();
      this.destroy();
      return false;
    }

    if (this.age >= 100 || this.health <= 0) { // Check if should be dead
      this.die();
      return false;
    }

    setTimeout(function() { this.eventCallback('update', this); }.bind(this), 1);

    //this.eventCallback('update', this);
  }
}

import * as Util from './util';
import * as TransmissionMethod from './types/transmissionMethod';

import { randomTraits } from './diseaseTrait';

function randomTransmissionMethod() {
  return TransmissionMethod.list[Util.getRandomInt(0, TransmissionMethod.list.length)];
}

export default class Disease {
  constructor(name, infectionRate, fatalityRate, immunityRate, transmission, traits) {
    this.name = name || `disease-${Util.randomHalfName()}`;

    this.infectionRate = infectionRate || Util.getRandomInt(1, 101);
    this.fatalityRate = fatalityRate || Util.getRandomInt(1, 101);
    this.immunityRate = immunityRate || Util.getRandomInt(1, 101);

    this.transmission = transmission || randomTransmissionMethod();

    this.traits = traits || randomTraits();
  }

  infect(object) {
    if (object === undefined || object.immunity[this.name] >= 100 || object.infections.includes(this)) {
      return false;
    }

    object.infections.push(this);
    object.immunity[this.name] = 0;

    object.eventCallback('infection', {thing: object, disease: this});

    return true;
  }

  uninfect(object) {
    if (object === undefined || !object.infections.includes(this)) {
      return false;
    }

    object.infections.splice(object.infections.indexOf(this), 1);

    object.eventCallback('uninfection', {thing: object, disease: this});

    return true;
  }

  infectRandom(world) {
    let o;

    function infectRandomCreature(d) {
      if (world.creatures.filter((o) => !(o.immunity[d.name] >= 100 || o.infections.includes(d))).length < 1) {
        return false;
      }

      o = world.creatures[Util.getRandomInt(0, world.creatures.length)];

      return d.infect(o);
    }

    function infectRandomFood(d) {
      if (world.food.filter((o) => !(o.immunity[d.name] >= 100 || o.infections.includes(d))).length < 1) {
        return false;  
      }
      
      o = world.food[Util.getRandomInt(0, world.food.length)];

      return d.infect(o);
    }

    switch (this.transmission) {
      case TransmissionMethod.creature:
        infectRandomCreature(this);
        break;
      case TransmissionMethod.food:
        infectRandomFood(this);
        break;
      case TransmissionMethod.both:
        if (Math.random() >= 0.5) {
          infectRandomCreature(this);
        } else {
          infectRandomFood(this);
        }
        break;
    }

    return o;
  }

  checkDie(object) {
    let adjustedRate = this.fatalityRate + (this.fatalityRate * ((100 - object.efficiency.immune) / 100));
    adjustedRate /= 100;

    if (adjustedRate > Math.random() * 100) {
      if (object.die !== undefined) {
        object.die();
      } else {
        object.destroy();
      }

      return true;
    }

    return false;
  }

  run(object) {
    if (this.checkDie(object)) {
      return false;
    }

    this.traits.forEach((x) => x.run(object));

    let transmissions = [];
    switch (this.transmission) {
      case TransmissionMethod.creature:
        transmissions = ['creature'];
        break;
      case TransmissionMethod.food:
        transmissions = ['food'];
        break;
      case TransmissionMethod.both:
        transmissions = ['creature', 'food'];
        break;
    }

    for (let t of transmissions) {
      let nearby = object.world.food;

      if (t === 'creature') {
        nearby = object.world.creatures;
      }

      nearby = nearby.filter((f) => Util.distance(object, f) < 30 / 100 * this.infectionRate);

      for (let o of nearby) {
        if (this.infectionRate > Math.random() * 100) {
          this.infect(o);
        }
      }
    }

    object.immunity[this.name] += 1 / 100 * this.immunityRate;

    if (object.immunity[this.name] >= 100) {
      this.uninfect(object);
    }
  }
}
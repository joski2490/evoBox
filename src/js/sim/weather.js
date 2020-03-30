import * as Util from './util';

function randomManip() {
  return (Math.random() * 2) - 1;
}

export class Wind {
  constructor(x, y) {
    this.x = x || randomManip();
    this.y = y || randomManip();
  }

  update() {
    this.x += randomManip() / 100;
    this.x += randomManip() / 100;
  }
}

export class RainPlace {
  constructor(wind, x, y, width, height, severity) {
    this.x = x || Util.getRandomInt(-100, 101);
    this.y = y || Util.getRandomInt(-100, 101);

    this.width = width || Util.getRandomInt(5, 51);
    this.height = height || Util.getRandomInt(5, 31);

    this.severity = severity || Util.getRandomInt(1, 101);
    this.wind = wind;
  } 

  update() {
    this.x += this.wind.x;
    this.y += this.wind.y;

    this.severity += randomManip() / 10;
  }
}
export default class Weather {
  constructor() {
    this.rainPlaces = [];
    this.wind = new Wind;
  }

  update() {
    this.wind.update();
    this.rainPlaces.forEach((p) => p.update());

    if (0.1 > Math.random()) {
      this.rainPlaces.push(new RainPlace(this.wind));
    }
  }
}
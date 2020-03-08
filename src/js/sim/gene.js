import * as Util from './util';

export default class Gene {
  constructor(name, num) {
    this.name = name;
    this.num = num || Util.getRandomInt(0, 101);
  }

  mutate() {
    let n = Util.getRandomInt(0, 101)
    this.num = n;

    return this;
  }
}
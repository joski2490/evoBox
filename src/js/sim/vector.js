export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  multiply(s) {
    this.x *= s;
    this.y *= s;
  }

  divide(s) {
    this.x /= s;
    this.y /= s;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalise() {
    if (this.x === 0 && this.y === 0) { return; }

    this.divide(this.magnitude());
  }
}
import { geneNames } from './types/geneNames';
import Gene from './gene';
import * as Sex from './types/sex';
import { names } from './types/names';

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

export function randomGenes() {
  let n = new Map();

  for (let g of geneNames) {
    n.set(g, new Gene(g));
  }

  return n;
}

export function getRandom(v, no) {
  let k = no;

  while (k === no) {
    let keys = Object.keys(v);
    k = keys[getRandomInt(0, keys.length)];
  }

  return v[k];
}

export function randomSex() {
  let interSexChance = 0.02;

  if (Math.random() < interSexChance) {
    return Sex.intersex;
  }

  if (Math.random() > 0.5) {
    return Sex.male;
  }

  return Sex.female;
}

function randomCharSegment() {
  return Math.random().toString(36).substr(2, 5);
}

export function randomChars() {
  return randomCharSegment() + randomCharSegment() + randomCharSegment();
}

export function randomHalfName() {
  return names[getRandomInt(0, names.length)];
}

export function randomName() {
  return names[getRandomInt(0, names.length)] + ' ' + names[getRandomInt(0, names.length)];
}

export function distance(obj1, obj2) {
  return Math.sqrt(Math.pow(obj2.x - obj1.x, 2) + Math.pow(obj2.y - obj1.y, 2));
}

export function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}
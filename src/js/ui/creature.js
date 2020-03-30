import * as UIUtil from './util';
import * as UIFood from './food';
import { Window, dragElement } from './window';

import { addParticles } from './particles';

function updateWindow(creature, windowBody) {
  windowBody.innerHTML = '';

  let rows = [
    ['Food', Math.round(creature.food)],
    ['Age', Math.round(creature.age)],
    ['Dead', creature.dead],
    ['Sex', creature.sex],
    ['Generation', creature.generation],
    ['lastReproduction', creature.lastReproduction],
    ['lookingForMate', creature.lookingForMate]
  ];

  for (let r of rows) {
    let row = document.createElement('div');
    row.className = 'row';

    let rowLeft = document.createElement('div');
    rowLeft.className = 'row-left';
    rowLeft.innerText = r[0];

    let rowRight = document.createElement('div');
    rowRight.className = 'row-right';
    rowRight.innerText = r[1];

    row.appendChild(rowLeft);
    row.appendChild(rowRight);

    windowBody.appendChild(row);
  }

  if (creature.target === undefined) {
    return false;
  }

  let el = document.getElementById(`creature-${UIUtil.makeID(creature.name)}`);

  if (el === null) {
    return false;
  }

  let target = creature.target.type === 'food' ? document.getElementById(`food-${creature.target.name}`) : document.getElementById(`creature-${UIUtil.makeID(creature.target.name)}`);

  console.warn(el, target);

  UIUtil.lineBetween(el, target);
}

export function create(creature) {
}

export function die(creature) {
  UIUtil.addLog(`${creature.name} died (${creature.food <= 0 ? 'starvation' : (creature.age >= 100 ? 'old age' : 'other')})`, 'bad');

  addParticles('skull', 5, creature);
}

export function update(creature) {

  // el.innerText = decider;

  return true;
}

export function destroy(creature) {
}

export function mutate({creature, gene}) {
  UIUtil.addLog(`${creature.name} mutated (${gene.name})`);

  addParticles('mutate', 5, creature);
}

export function eat({creature, food}) {
}

export function reproduce({creature, child}) {
  UIUtil.addLog(`${creature.name} reproduced (${child.name})`, 'good');

  addParticles('reproduce', 5, creature);
}


export function infection({thing, disease}) {
  UIUtil.addLog(`${thing.name} became infected with ${disease.name}`, 'bad');
}

export function uninfection({thing, disease}) {
  UIUtil.addLog(`${thing.name} is no longer infected with ${disease.name}`, 'bad');
}
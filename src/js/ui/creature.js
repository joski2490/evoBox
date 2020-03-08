import * as UIUtil from './util';
import * as UIFood from './food';

export function create(creature) {
  if (document.getElementById(`creature-${creature.name}`) !== null) {
    return false;
  }

  let el = document.createElement('div');
  el.id = `creature-${creature.name}`;
  el.className = 'creature';

  document.body.appendChild(el);

  update(creature);

  return true;
}

export function die(creature) {
  document.getElementById(`creature-${creature.name}`).classList.add('dead-creature');

  UIUtil.addLog(`${creature.name} died`);
}

export function update(creature) {
  let el = document.getElementById(`creature-${creature.name}`);

  if (el === null) {
    return false;
  }

  if (isNaN(creature.food)) {
    console.warn(creature);
  }

  el.innerText = `${creature.generation}_${Math.round(creature.food)}`;

  let pos = UIUtil.getWindowPosition(creature);

  el.style.left = `${pos.x}px`;
  el.style.top = `${pos.y}px`;

  let size = creature.food / 3;
  size = size < 20 ? 20 : size;

  return true;

  /*el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.lineHeight = `${size}px`;*/
}

export function destory(creature) {
  if (document.getElementById(`creature-${creature.name}`) === null) {
    return false;
  }

  document.body.removeChild(document.getElementById(`creature-${creature.name}`));

  return true;
}

export function mutate({creature, gene}) {
  UIUtil.addLog(`${creature.name} mutated (${gene.name})`);
}

export function eat(food) {
  UIFood.update(food);
}

export function reproduce(child) {

}
import * as UIUtil from './util';
import * as SimUtil from '/js/sim/util';

export function create(food) {
  if (document.getElementById(`food-${food.name}`) !== null) {
    return false;
  }

  let el = document.createElement('div');
  el.id = `food-${food.name}`;
  el.className = 'food';

  document.getElementById('sandbox').appendChild(el);

  update(food);

  return true;
}

export function update(food) {
  let el = document.getElementById(`food-${food.name}`);

  if (el === null) {
    return false;
  }

  el.innerText = Math.round(food.value());

  el.style.backgroundColor = `rgb(${food.quality * 2.55}, 0, 0)`;

  let pos = UIUtil.getWindowPosition(food);

  el.style.left = `${pos.x}px`;
  el.style.top = `${pos.y}px`;

  let size = food.quantity / 3 * UIUtil.sizeFactor();
  size = size < 15 ? 15 : size;

  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.lineHeight = `${size}px`;

  return true;
}

export function destroy(food) {
  if (document.getElementById(`food-${food.name}`) === null) {
    return false;
  }

  document.getElementById('sandbox').removeChild(document.getElementById(`food-${food.name}`));

  return true;
}
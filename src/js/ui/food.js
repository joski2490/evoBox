import * as UIUtil from './util';
import * as SimUtil from '/js/sim/util';

let foods = [...'🍇🍈🍉🍊🍋🍌🍍🥭🍎🍏🍐🍑🍒🍓🥝🍅🥥🥑🍆🥔🥕🌽🌶🥒🥬🥦🍄🥜🌰🍞🥐🥖🥨🥯🥞🧀🍖🍗🥩🥓🍔🍟🍕🌭🥪🌮🌯🥙🍳🥘🍲🥣🥗🍿🧂🥫🍱🍘🍙🍚🍛🍜🍝🍠🍢🍣🍤🍥🥮🍡🥟🥠🥡🍦🍧🍨🍩🍪🎂🍰🧁🥧🍫🍬🍭🍮🍯🍼🥛☕🍵🍶🍾🍷🍸🍹🍺🍻🥂🥃🥤'];

export function create(food) {
  if (document.getElementById(`food-${food.name}`) !== null) {
    return false;
  }

  let el = document.createElement('div');
  el.id = `food-${food.name}`;
  el.className = 'food';

  el.setAttribute('data-before-content', foods[SimUtil.getRandomInt(0, foods.length)]);
  el.style.setProperty('--before-opacity', '0');

  document.getElementById('sandbox').appendChild(el);

  update(food);

  return true;
}

export function update(food) {
  let el = document.getElementById(`food-${food.name}`);

  if (el === null) {
    return false;
  }
  
  // el.style.color = `rgb(0, ${food.quality * 2.55}, 0)`;

  let pos = UIUtil.getWindowPosition(food);

  el.style.left = `${pos.x}px`;
  el.style.top = `${pos.y}px`;

  let size = food.quantity * UIUtil.sizeFactor();
  size = size < 15 ? 15 : size;

  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.lineHeight = `${size}px`;

  if (food.world.options.emojiMode === true) {
    el.style.setProperty('--before-size', `${size}px`);
    el.style.backgroundColor = 'transparent';
    el.style.setProperty('--before-opacity', '1');

    el.innerText = '';
  } else {
    el.style.setProperty('--before-opacity', '0');
    el.style.backgroundColor = `rgb(0, ${food.quality * 2.55}, 0)`;

    el.innerText = Math.round(food.value());
  }

  return true;
}

export function destroy(food) {
  if (document.getElementById(`food-${food.name}`) === null) {
    return false;
  }

  document.getElementById('sandbox').removeChild(document.getElementById(`food-${food.name}`));

  return true;
}
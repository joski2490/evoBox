import * as UIUtil from './util';
import * as SimUtil from '/js/sim/util';
import * as UIFood from './food';
import { Window, dragElement } from './window';

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
}

export function create(creature) {
  if (document.getElementById(`creature-${creature.name}`) !== null) {
    return false;
  }

  let el = document.createElement('div');
  el.id = `creature-${UIUtil.makeID(creature.name)}`;
  el.className = 'creature';
  el.onclick = function(e) {
    [...document.getElementsByClassName('window')].forEach((x) => document.body.removeChild(x));

    let window = Window(creature.name, e.clientX, e.clientY);

    updateWindow(creature, window[1]);
  };

  document.getElementById('sandbox').appendChild(el);

  update(creature);

  return true;
}

export function die(creature) {
  let el = document.getElementById(`creature-${UIUtil.makeID(creature.name)}`);

  if (el === null) {
    return false;
  }

  el.classList.add('dead-creature');

  el.style.color = '#ffffff';
  el.style.backgroundColor = 'gray';

  UIUtil.addLog(`${creature.name} died`);

  addParticles('skull', 5, creature);
}

export function update(creature) {
  let el = document.getElementById(`creature-${UIUtil.makeID(creature.name)}`);

  if (el === null) {
    return false;
  }

  let window = document.getElementById(`window-${UIUtil.makeID(creature.name)}`);

  if (window !== null) {
    updateWindow(creature, window.children[1]);
  }

  if (isNaN(creature.food)) {
    console.warn(creature);
  }

  el.innerText = creature.name.split(' ').join('\n');

  let pos = UIUtil.getWindowPosition(creature);

  el.style.left = `${pos.x}px`;
  el.style.top = `${pos.y}px`;

  let scaleAll = creature.world.creatures.map((x) => x.food).sort((a, b) => b - a);
  let scaleMax = scaleAll[0];

  let size = (120 - 40) * (creature.food / scaleMax) + 40;

  size *= UIUtil.sizeFactor();

  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.lineHeight = `${size / 2}px`;
  el.style.fontSize = `${size / 5}px`;

  el.style.backgroundColor = `hsl(${creature.genes.get('colorHue').num * 3.6}, 100%, ${creature.genes.get('colorLightness').num}%)`;
  
  let rgb = el.style.backgroundColor.replace('rgb(', '').replace(')', '').split(', ').map((x) => parseFloat(x));

  let decider = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
  el.style.color = decider > 180 ? '#1f1f1f' : '#ffffff';

  // el.innerText = decider;

  return true;
}

export function destroy(creature) {
  if (document.getElementById(`creature-${UIUtil.makeID(creature.name)}`) === null) {
    console.log(creature.name);
    return false;
  }

  document.getElementById('sandbox').removeChild(document.getElementById(`creature-${UIUtil.makeID(creature.name)}`));

  let window = document.getElementById(`window-${UIUtil.makeID(creature.name)}`);

  if (window !== null) {
    document.body.removeChild(window);
  }

  return true;
}

export function mutate({creature, gene}) {
  UIUtil.addLog(`${creature.name} mutated (${gene.name})`);

  addParticles('mutate', 5, creature);
}

export function eat({creature, food}) {
  UIFood.update(food);
}

function addParticles(type, amount, creature) {
  for (let i = 0; i < amount; i++) {
    setTimeout(function() {
      addParticle(type, creature);
    }, i * 50);
  }
}

function addParticle(type, creature) {
  let creaturePos = UIUtil.getWindowPosition(creature);

  let container = document.createElement('div');
  container.className = 'particle-container';

  let randomLeft = SimUtil.getRandomInt(-30, 31);
  let randomTop = SimUtil.getRandomInt(30, 71);

  container.style.left = `${creaturePos.x - randomLeft}px`;
  container.style.top = `${creaturePos.y - randomTop}px`;
  container.style.transitionDuration = `${1000 / creature.world.speed}ms`;

  let particle = document.createElement('div');
  particle.className = type;

  container.appendChild(particle);

  document.getElementById('sandbox').appendChild(container);

  setTimeout(function() {
    container.style.opacity = 0;
    container.style.top = `${creaturePos.y - randomTop - 50}px`;
  }, 10);

  setTimeout(function() {
    document.getElementById('sandbox').removeChild(container);
  }, 1000 / creature.world.speed)
}

export function reproduce({creature, child}) {
  UIUtil.addLog(`${creature.name} reproduced (${child.name})`);

  addParticles('heart', 5, creature);
}
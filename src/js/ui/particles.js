import * as UIUtil from './util';
import * as SimUtil from '/js/sim/util';
import * as Renderer from './renderer';

export function addParticles(type, amount, creature) {
  for (let i = 0; i < amount; i++) {
    setTimeout(function() {
      addParticle(type, creature);
    }, i * 50);
  }
}

export function addParticle(type, creature, extra, startingAge) {
  let color = '#ffffff';
  let text = '';

  if (type === 'mutate') {
    text = '🧬';
  }

  if (type === 'lookingForMate') {
    text = '💔';
  }

  if (type === 'reproduce') {
    text = '💕';
  }

  if (type === 'skull') {
    text = '☠';
  }

  if (type === 'infection') {
    text = '☣️';
    color = 'red';
  }
  
  text += extra || '';

  let creaturePos = UIUtil.getWindowPosition(creature);

  let randomLeft = SimUtil.getRandomInt(-30, 31);
  let randomTop = SimUtil.getRandomInt(30, 71);

  Renderer.particles.push({
    age: startingAge || 0,
    text: text,
    color: color,
    x: creaturePos.x - randomLeft,
    y: creaturePos.y - randomTop
  });

  /*let creaturePos = UIUtil.getWindowPosition(creature);

  let container = document.createElement('div');
  container.className = 'particle-container';

  let randomLeft = SimUtil.getRandomInt(-30, 31);
  let randomTop = SimUtil.getRandomInt(30, 71);

  container.style.left = `${creaturePos.x - randomLeft}px`;
  container.style.top = `${creaturePos.y - randomTop}px`;
  container.style.transitionDuration = `${1000 / creature.world.speed}ms`;

  let particle = document.createElement('div');
  particle.className = type;

  if (type === 'infection') {
    particle.innerText = creature.infections.map((x) => x.name).join(', ');
  }

  container.appendChild(particle);

  document.getElementById('sandbox').appendChild(container);

  setTimeout(function() {
    container.style.opacity = 0;
    container.style.top = `${creaturePos.y - randomTop - 50}px`;
  }, 10);

  setTimeout(function() {
    document.getElementById('sandbox').removeChild(container);
  }, 1000 / creature.world.speed)*/
}
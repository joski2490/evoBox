import * as UICreature from './creature';
import * as UIFood from './food';
import * as UIUtil from './util';

import { Window, dragElement } from './window';

let screenSize = 'full';

async function creatureCallback(type, data) {
  let f = UICreature[type];

  if (f !== undefined) {
    f(data);
  }
}

async function foodCallback(type, data) {
  let f = UIFood[type];

  if (f !== undefined) {
    f(data);
  }
}

async function worldCallback(type, data) {
  if (type === 'addCreature') {
    data.eventCallback = creatureCallback;
  }

  if (type === 'removeCreature') {
    UICreature.destroy(data);
  }

  if (type === 'addFood') {
    data.eventCallback = foodCallback;
  }

  if (type === 'removeFood') {
    UIFood.destroy(data);
  }

  if (type === 'update') {
    document.getElementById('play').style.display = data.paused ? 'inline' : 'none';
    document.getElementById('pause').style.display = data.paused ? 'none' : 'inline';

    document.getElementById('sf').innerText = `${UIUtil.showNumber(data.speed)}x`;
    document.getElementById('zf').innerText = `${UIUtil.showNumber(UIUtil.sizeFactor())}x`;

    document.getElementById('elapsed').innerText = `${elapsedTime(data)}`;

    if (screenSize === 'full') {
      let sandbox = document.getElementById('sandbox');
      let cWidth = sandbox.style.width.replace('px', '');
      let sWidth = window.innerWidth - 10;
      if (window.innerHeight > sWidth) {
        sWidth = window.innerHeight - 10;
      }

      // let diff = cWidth - sWidth;

      if (cWidth != sWidth) {
        sandbox.style.width = `${sWidth}px`;
        sandbox.style.height = `${sWidth}px`;

        let top = 0; //parseFloat(sandbox.style.top.replace('px', '')) + diff;
        top = top > 0 ? 0 : top;

        sandbox.style.top = `${top}px`;

        let left = 0; //parseFloat(sandbox.style.left.replace('px', '')) + diff;
        left = left > 0 ? 0 : left;

        sandbox.style.left = `${left}px`;
      }
    }
  }
}

function elapsedTime(world) {
  let secs = Math.floor(world.elapsedTime / 1000);

  if (secs >= 60) {
    let mins = Math.floor(secs / 60);
    secs = Math.floor(secs % 60);

    secs = secs.toString().length === 1 ? `0${secs}` : secs;

    return `${mins}:${secs}`
  }

  return secs.toString();
}

export function UIWorld(world) {
  world.eventCallback = worldCallback;

  window.onload = function() {
    UIInit(world);
  };

  world.options.emojiMode = false;
}

export function UIInit(world) {
  let fired = false;

  document.onkeypress = function (e) {
    if (!fired) {
      console.log(e);

      if (e.code === 'Space') {
        world.paused = !world.paused;
      }

      if (e.key === '>') {
        world.speed += 0.25;
      }

      if (e.key === '<') {
        world.speed -= 0.25;
      }

      if (e.key === 'd') {
        let debug = document.getElementById('debug');
        document.getElementById('debug').className = debug.className === '' ? 'show' : '';
      }

      let update = false;

      if (e.key === '=') {
        let sandbox = document.getElementById('sandbox');
        let width = sandbox.style.width ? sandbox.style.width : '2000px';
        let size = parseFloat(width.replace('px', '')) + 500;

        sandbox.style.width = `${size}px`;
        sandbox.style.height = `${size}px`;

        update = true;
      }

      if (e.key === '-') {
        let sandbox = document.getElementById('sandbox');
        let width = sandbox.style.width ? sandbox.style.width : '2000px';
        let size = parseFloat(width.replace('px', '')) - 500;
        size = size < window.innerWidth ? (Math.floor(window.innerWidth / 500) + 1) * 500 : size;

        let changed = size !== width;

        sandbox.style.width = `${size}px`;
        sandbox.style.height = `${size}px`;

        if (changed) {
          let top = parseFloat(sandbox.style.top.replace('px', '')) + 500;
          top = top > 0 ? 0 : top;

          sandbox.style.top = `${top}px`;

          let left = parseFloat(sandbox.style.left.replace('px', '')) + 500;
          left = left > 0 ? 0 : left;

          sandbox.style.left = `${left}px`;

          update = true;
        }
      }

      if (e.key === 'f') {
        screenSize = screenSize === 'full' ? 'dynamic' : 'full';
      }

      if (e.key === 'e') {
        world.options.emojiMode = !world.options.emojiMode;

        update = true;
      }

      fired = true;

      if (update === true) {
        for (let c of world.creatures) {
          UICreature.update(c);
        }

        for (let f of world.food) {
          UIFood.update(f);
        }
      }
    }

    e.preventDefault();
  };

  document.onkeyup = function() {
    fired = false;
  };

  document.getElementById('play').onclick = function() {
    world.paused = false;
  };

  document.getElementById('pause').onclick = function() {
    world.paused = true;
  };

  document.getElementById('slow').onclick = function() {
    world.speed -= 0.25;
  };

  document.getElementById('fast').onclick = function() {
    world.speed += 0.25;
  };

  document.getElementById('restart').onclick = function() {
    world.restart();
  };

  dragElement(document.getElementById('sandbox'));
}
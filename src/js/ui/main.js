import * as UICreature from './creature';
import * as UIFood from './food';
import * as UIUtil from './util';
import SimFood from '/js/sim/food';

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
    UICreature.create(data);
  }

  if (type === 'removeCreature') {
    UICreature.destroy(data);
  }

  if (type === 'addFood') {
    data.eventCallback = foodCallback;
    UIFood.create(data);
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

function UIUpdate(world) {
  for (let c of world.creatures) {
    UICreature.update(c);
  }

  for (let f of world.food) {
    UIFood.update(f);
  }
}

function increaseSpeed(world) {
  world.speed = world.speed >= 5 ? world.speed : world.speed + 0.25;
}

function decreaseSpeed(world) {
  world.speed = world.speed <= 0.25 ? world.speed : world.speed - 0.25;
}

function showControls() {
  let win = new Window('Controls', 10, 10);
  win[0].style.height = '380px';

  let rows = [['Speed Up', '>'], ['Slow Down', '<'], ['Pause', 'Space'], ['', ''], ['Zoom Out', '-'], ['Zoom In', '='], ['Full Mode', 'f'], ['', ''], ['Controls', '?'], ['Debug', 'd'], ['🙂 🇲​🇴​🇩​🇪', 'e']];

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

    win[1].appendChild(row);
  }
}

export function UIInit(world) {
  let fired = false;

  showControls();

  document.onkeypress = function (e) {
    if (!fired) {
      console.log(e);

      if (e.code === 'Space') {
        world.paused = !world.paused;
      }

      if (e.key === '>') {
        increaseSpeed(world);
      }

      if (e.key === '<') {
        decreaseSpeed(world);
      }

      if (e.key === 'd') {
        let debug = document.getElementById('debug');
        document.getElementById('debug').className = debug.className === '' ? 'show' : '';
      }

      if (e.key === '=') {
        let sandbox = document.getElementById('sandbox');
        let width = sandbox.style.width ? sandbox.style.width : '2000px';
        let size = parseFloat(width.replace('px', '')) + 500;

        sandbox.style.width = `${size}px`;
        sandbox.style.height = `${size}px`;

        UIUpdate(world);
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

          UIUpdate(world);
        }
      }

      if (e.key === 'f') {
        screenSize = screenSize === 'full' ? 'dynamic' : 'full';
      }

      if (e.key === 'e') {
        world.options.emojiMode = !world.options.emojiMode;

        UIUpdate(world);
      }

      if (e.key === '?') {
        showControls();
      }

      fired = true;
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
    decreaseSpeed(world);
  };

  document.getElementById('fast').onclick = function() {
    increaseSpeed(world);
  };

  document.getElementById('restart').onclick = function() {
    world.restart();
  };

  document.getElementById('sandbox').ondblclick = function(e) {
    let x = e.clientX - parseFloat(document.getElementById('sandbox').style.left.replace('px', ''));
    let y = e.clientY - parseFloat(document.getElementById('sandbox').style.top.replace('px', ''));

    let pos = UIUtil.getRelativePosition(x, y);

    world.addFood(new SimFood(world, undefined, undefined, pos.x, pos.y));

    UIUpdate(world);
  };

  dragElement(document.getElementById('sandbox'));
}
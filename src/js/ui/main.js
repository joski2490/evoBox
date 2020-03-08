import * as UICreature from './creature';
import * as UIFood from './food';

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

  if (type === 'addFood') {
    data.eventCallback = foodCallback;
  }

  if (type === 'removeFood') {
    //UIFood.destroy(data);
  }

  if (type === 'update') {
    document.getElementById('play').style.display = data.paused ? 'inline' : 'none';
    document.getElementById('pause').style.display = data.paused ? 'none' : 'inline';

    document.getElementById('sf').innerText = `${data.speed}x`;
    document.getElementById('elapsed').innerText = elapsedTime(data);
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

      fired = true;
    }
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
}
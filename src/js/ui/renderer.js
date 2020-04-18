import * as UIUtil from './util';
import * as SimUtil from '/js/sim/util';
import { addParticle } from './particles';

export let canvas, ctx;
export let fps = 0;
let lastCalledTime;
let fpsArr = [];

let frame = 0;

let world;

export let particles = [];

let foods = [...'🍇🍈🍉🍊🍋🍌🍍🥭🍎🍏🍐🍑🍒🍓🥝🍅🥥🥑🍆🥔🥕🌽🌶🥒🥬🥦🍄🥜🌰🍞🥐🥖🥨🥯🥞🧀🍖🍗🥩🥓🍔🍟🍕🌭🥪🌮🌯🥙🍳🥘🍲🥣🥗🍿🧂🥫🍱🍘🍙🍚🍛🍜🍝🍠🍢🍣🍤🍥🥮🍡🥟🥠🥡🍦🍧🍨🍩🍪🎂🍰🧁🥧🍫🍬🍭🍮🍯🍼🥛☕🍵🍶🍾🍷🍸🍹🍺🍻🥂🥃🥤'];

export function init(passedWorld) {
  world = passedWorld;

  canvas = document.createElement('canvas');
  canvas.width = 2000;
  canvas.height = 2000;
  canvas.id = 'sandbox';

  document.body.prepend(canvas);

  ctx = canvas.getContext('2d');

  update();
}

function renderCircle(x, y, size, fillColor, borderColor) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI, false);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = borderColor;
  ctx.stroke();
}

function renderText(x, y, size, color, text, align) {
  ctx.font = `${size}px Roboto`;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'center';

  ctx.fillText(text, x, y);
}

function adjustPos(current, wanted) {
  return {x: adjustParam(current.x, wanted.x), y: adjustParam(current.y, wanted.y)};
}

function adjustParam(current, wanted, amnt) {
  return SimUtil.lerp(current, wanted, amnt || 0.2);
}

function hslToRgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
      r = g = b = l; // achromatic
  } else {
      let hue2rgb = function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      };

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


export function update() {
  let startTime = performance.now();

  let el = document.getElementById('sandbox');

  let sLeft = -el.offsetLeft;
  let sTop = -el.offsetTop;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgb(50, 56, 56)';
  ctx.lineWidth = 10;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  let scaleAll = world.creatures.map((x) => x.food).sort((a, b) => b - a);
  let scaleMax = scaleAll[0];

  for (let c of world.creatures) {
    c.rendererPos = c.rendererPos || {x: c.x, y: c.y};
    c.rendererPos = adjustPos(c.rendererPos, {x: c.x, y: c.y});

    let pos = UIUtil.getWindowPosition(c.rendererPos);

    if (c.target?.rendererPos !== undefined) { // Draw line to target first so it's behind
      ctx.globalAlpha = 0.25;

      ctx.strokeStyle = `hsl(${c.genes.get('colorHue').num * 3.6}, 100%, ${c.genes.get('colorLightness').num + 10}%)`;

      ctx.beginPath();

      ctx.setLineDash([20, 5]);

      ctx.moveTo(pos.x, pos.y);

      let tPos = UIUtil.getWindowPosition(c.target.rendererPos);

      ctx.lineTo(tPos.x, tPos.y);
      
      ctx.stroke();

      ctx.setLineDash([]);

      ctx.globalAlpha = 1;
    }

    if (!(pos.x > sLeft - 100 && pos.x < sLeft + window.innerWidth + 100) || !(pos.y > sTop - 100 && pos.y < sTop + window.innerHeight + 100)) {
      continue;
    }

    let size = (80 - 40) * (c.food / scaleMax) + 40;

    size *= UIUtil.sizeFactor();

    let col = c.dead ? 'gray' : `hsl(${c.genes.get('colorHue').num * 3.6}, 100%, ${c.genes.get('colorLightness').num}%)`;

    renderCircle(pos.x, pos.y, size,
      col,
      `hsl(${c.genes.get('colorHue').num * 3.6}, 100%, ${c.genes.get('colorLightness').num - 10}%)`);

    let split = col.replace('hsl(', '').replace(/%/g, '').replace(')', '').split(', ').map((x) => parseFloat(x));
  
    let rgb = hslToRgb(split[0] / 360, split[1] / 100, split[2] / 100);

    let decider = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;

    let splitName = c.name.split(' ');
    renderText(pos.x, pos.y - (size / 4) + size / 8, size / 3, decider > 180 ? '#1f1f1f' : '#ffffff', splitName[0]);
    renderText(pos.x, pos.y + (size / 4) + size / 8, size / 3, decider > 180 ? '#1f1f1f' : '#ffffff', splitName[1]);

    if (frame % 20 === 0) {
      if (c.infections.length > 0) {
        addParticle('infection', c, '', 20);
      }

      if (c.lookingForMate) {
        addParticle('lookingForMate', c, '', 20);
      }
    }
  }

  for (let f of world.food) {
    f.rendererPos = f.rendererPos || {x: f.x, y: f.y};
    f.rendererPos = adjustPos(f.rendererPos, {x: f.x, y: f.y});

    f.rendererQuantity = f.rendererQuantity || f.quantity;
    f.rendererQuantity = adjustParam(f.rendererQuantity, f.quantity, 0.5);

    f.rendererEmoji = f.rendererEmoji || foods[SimUtil.getRandomInt(0, foods.length)];

    let pos = UIUtil.getWindowPosition(f.rendererPos);

    if (!(pos.x > sLeft - 100 && pos.x < sLeft + window.innerWidth + 100) || !(pos.y > sTop - 100 && pos.y < sTop + window.innerHeight + 100)) {
      continue;
    }

    let size = (f.rendererQuantity / 2) * UIUtil.sizeFactor();

    if (world.options.emojiMode) {
      renderText(pos.x, pos.y + 10, size + 15,
        `hsl(100, 100%, ${f.quality}%)`,
        f.rendererEmoji);
    } else {
      renderCircle(pos.x, pos.y, size,
        `hsl(100, 100%, ${f.quality}%)`,
        `hsl(100, 100%, ${f.quality - 10}%)`);
    }

    if (frame % 20 === 0) {
      if (f.infections.length > 0) {
        addParticle('infection', f, '', 20);
      }
    }

    // renderText(screenPos.x, screenPos.y + size / 8, size / 3, '#ffffff', Math.round(f.value()));
  }

  for (let p of particles) {
    ctx.globalAlpha = (100 - p.age) / 100;

    renderText(p.x, p.y, '18', p.color, p.text);

    ctx.globalAlpha = 1;

    p.age += 2;
    p.y--;

    if (p.age >= 100) {
      particles.splice(particles.indexOf(p), 1);
    }
  }

  if (!lastCalledTime) {
    lastCalledTime = performance.now();
    fps = 0;
  } else {
    let delta = (performance.now() - lastCalledTime) / 1000;
    fps = Math.round(1 / delta);

    lastCalledTime = performance.now();

    if (fpsArr.length >= 1000) {
      fpsArr.pop();
    }

    fpsArr.unshift(fps);
  }

  ctx.globalAlpha = 0.5;

  let sandbox = document.getElementById('sandbox');

  let fpsText = `FPS: ${Math.round(fpsArr.reduce((p, c) => p + c, 0) / fpsArr.length)} (Min: ${Math.min(...fpsArr)} | Max: ${Math.max(...fpsArr)})`;

  renderText(10 + -sandbox.offsetLeft, 25 + -sandbox.offsetTop, 18, '#ffffff', `${fpsText} | UPS: ${world.ups} (aim: ${Math.round(1000 / world.updateBetween)})`, 'left');

  ctx.globalAlpha = 1;

  frame++;

  requestAnimationFrame(update);
}
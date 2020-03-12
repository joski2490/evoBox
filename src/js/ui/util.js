export function getWindowPosition(thing) {
  return { x: document.getElementById('sandbox').offsetWidth / 100 * ((thing.x + 100) / 2), y: document.getElementById('sandbox').offsetWidth / 100 * ((thing.y + 100) / 2) };
}

export function sizeFactor() {
  let width = sandbox.style.width ? sandbox.style.width : '2000px';
  let size = parseFloat(width.replace('px', ''));

  return size / 2000; //(4000 - size) / 2000;
}

export function sizeAmount() {
  let width = sandbox.style.width ? sandbox.style.width : '2000px';
  return parseFloat(width.replace('px', ''))
}

let logLeft = 0;

export function addLog(msg) {
  let log = document.getElementById('log');

  let lineSplit = log.innerText.split('\n')
  if (lineSplit.length >= 10) {
    log.innerText = lineSplit.splice(1).join('\n');
  }

  let el = document.createElement('div');
  el.innerText = msg;

  log.appendChild(el);
  // log.innerText += `${msg}\n`;

  log.className = 'show';

  logLeft++;

  setTimeout(function() {
    let child = [...log.children].find((c) => c.innerText === msg);

    if (child === undefined) { return; }

    if (log.children.length === 1) {
      log.className = '';
    }

    log.removeChild(child);
  }, 2500);

  /*setTimeout(function() {
    logLeft--;

    /*if (logLeft === 0) {//if (log.innerText === old || log.innerText.replace(`${msg}\n`, '') === '') {
      log.className = '';
    }

    setTimeout(function () {
      let child = [...log.children].find((c) => c.innerText === msg);

      if (child === undefined) { return; }

      if (log.children.length === 1) {
        log.className = '';
      }

      setTimeout(function() {
        log.removeChild(child);
      }, 500);
    }, 1000);
  }, 2000);*/
}
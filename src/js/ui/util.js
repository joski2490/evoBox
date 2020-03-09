export function getWindowPosition(thing) {
  return { x: document.body.clientWidth / 100 * ((thing.x + 100) / 2), y: document.body.clientHeight / 100 * ((thing.y + 100) / 2) };
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
    logLeft--;

    /*if (logLeft === 0) {//if (log.innerText === old || log.innerText.replace(`${msg}\n`, '') === '') {
      log.className = '';
    }*/

    setTimeout(function () {
      let child = [...log.children].find((c) => c.innerText === msg);

      if (child === undefined) { return; }

      child.style.opacity = 0;

      if (log.children.length === 1) {
        log.className = '';
      }

      setTimeout(function() {
        log.removeChild(child);
      }, 500);
    }, 1000);
  }, 2000);
}
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

  log.innerText += `${msg}\n`;

  log.className = 'show';

  let old = log.innerText;

  logLeft++;

  setTimeout(function() {
    logLeft--;

    if (logLeft === 0) {//if (log.innerText === old || log.innerText.replace(`${msg}\n`, '') === '') {
      log.className = '';
    }

    setTimeout(function () {
      let without = log.innerText.replace(`${msg}\n`, '');
      log.innerText = without;
    }, 1000);
  }, 2000);
}
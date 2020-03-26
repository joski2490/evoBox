import * as UIUtil from './util';

export function Window(name, x, y) {
  let window = document.createElement('div');
  window.id = `window-${UIUtil.makeID(name)}`;
  window.className = 'window';

  window.style.left = `${x}px`;
  window.style.top = `${y}px`;

  let header = document.createElement('header');
  header.innerText = name;
  header.id = `${window.id}-header`;

  window.appendChild(header);

  let close = document.createElement('div');
  close.className = 'window-close';
  close.onclick = function() {
    window.classList.add('closing-window');

    setTimeout(function() {
      document.body.removeChild(window);
    }, 400);
  };

  header.appendChild(close);

  let body = document.createElement('div');
  body.className = 'window-body';

  window.appendChild(body);

  dragElement(window);

  document.body.appendChild(window);

  return [window, body];
}

export function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  let header = elmnt.children[0];
  header = header !== undefined ? header.id.includes('header') : undefined;

  if (header === true) {
    // if present, the header is where you move the DIV from:
    elmnt.children[0].onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:

    let sizeTop = elmnt.offsetTop - pos2;

    let sizeLeft = elmnt.offsetLeft - pos1;

    if (elmnt.id === 'sandbox') {
      sizeTop = sizeTop > 0 ? 0 : sizeTop;
      sizeLeft = sizeLeft > 0 ? 0 : sizeLeft;

      let adjTop = sizeTop + UIUtil.sizeAmount()
      if (adjTop < window.innerHeight) {
        sizeTop -= adjTop - window.innerHeight;
      }

      let adjLeft = sizeLeft + UIUtil.sizeAmount();
      if (adjLeft < window.innerWidth) {
        sizeLeft -= adjLeft - window.innerWidth;
      }
    }

    elmnt.style.top = sizeTop + "px";
    elmnt.style.left = sizeLeft + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
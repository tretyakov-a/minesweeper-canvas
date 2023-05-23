function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function renderNumber(n, len = 3) {
  const s = n.toString();
  
  return s.length < len ? '0'.repeat(len - s.length) + s : s;
}

function isClickOutside(e, classNames) {
  const composed = e.composedPath();

  return classNames.every(className => !composed.find(el => {
    return el.classList && el.classList.contains(className);
  }));
}


function renderTime(timeMs) {
  const ms = renderNumber(timeMs % 1000, 3);
  // const min = renderNumber(Math.floor(timeMs / 1000 / 60), 2);
  // const sec = renderNumber(Math.floor(timeMs / 1000) - min * 60, 2);
  const sec = renderNumber(Math.floor(timeMs / 1000), 1);
  return `${sec}.${ms} sec`;
}

export {
  randomNumber,
  renderNumber,
  isClickOutside,
  renderTime
}
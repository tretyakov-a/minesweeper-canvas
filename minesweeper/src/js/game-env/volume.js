let containerEl;
let barEl;
let thumbEl;
let volumeBtnEl;
let mouseMoveHandler;
let isThumbDragged = false;

const className = 'volume';
let value = 0.3;
let thumbCenterOffsetX = null;

const onVolumeChange = (newValue) => {
  value = newValue;
  const width = value * 100;
  const thumbWidth = thumbEl.getBoundingClientRect().width;

  barEl.style.width = `${width}%`;
  thumbEl.style.left = `calc(${width}% - ${thumbWidth / 2}px)`;
  containerEl.setAttribute('title', `Volume ${Math.trunc(width)}%`);
};

const handleClick = (e) => {
  if (e.target.classList.contains(`${className}__thumb`)) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;
  if (x < rect.left || x > rect.right) {
    return;
  }

  const xInside = e.pageX - rect.x - thumbCenterOffsetX;
  onVolumeChange(xInside / rect.width);
};

const handleMouseMove = (bounds) => (e) => {
  const x = (e.type === 'touchmove' ? e.touches[0].pageX : e.pageX) - thumbCenterOffsetX;
  if (x < bounds.left || x > bounds.right) {
    return;
  }

  const xInside = x - bounds.left;
  onVolumeChange(xInside / bounds.width);
};

const handleMouseUp = (e) => {
  if (e.type === 'touchend') {
    document.removeEventListener('touchmove', mouseMoveHandler);
    document.removeEventListener('touchend', handleMouseUp);
  } else {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  isThumbDragged = false;
  thumbEl.classList.remove('dragged');
};

const handleThumbMouseDown = (e) => {
  e.preventDefault();
  if (isThumbDragged) return;
  isThumbDragged = true;

  thumbCenterOffsetX = e.offsetX - thumbEl.getBoundingClientRect().width / 2;

  const { x, right, width } = containerEl.getBoundingClientRect();
  mouseMoveHandler = handleMouseMove({ left: x, right, width });

  if (e.type === 'touchstart') {
    document.addEventListener('touchmove', mouseMoveHandler);
    document.addEventListener('touchend', handleMouseUp);
  } else {
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', handleMouseUp);
  }

  thumbEl.classList.add('dragged');
};

const init = () => {
  containerEl = document.querySelector(`.${className}__bar-container`);
  barEl = document.querySelector(`.${className}__bar`);
  thumbEl = document.querySelector(`.${className}__thumb`);
  volumeBtnEl = document.querySelector('[data-action="mute"]');

  thumbEl.addEventListener('mousedown', handleThumbMouseDown);
  thumbEl.addEventListener('touchstart', handleThumbMouseDown);
  containerEl.addEventListener('click', handleClick);
};

export { init, value };

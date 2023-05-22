export default class Volume extends EventTarget {
  constructor(value) {
    super();
    this.className = 'volume';

    this.thumbWidth = 16;
    this.mouseMoveHandler = null;
    this.isThumbDragged = false;
    this.containerEl = document.querySelector(`.${this.className}__bar-container`);
    this.barEl = document.querySelector(`.${this.className}__bar`);
    this.thumbEl = document.querySelector(`.${this.className}__thumb`);

    this.thumbEl.addEventListener('mousedown', this.handleThumbMouseDown);
    this.thumbEl.addEventListener('touchstart', this.handleThumbMouseDown);
    this.containerEl.addEventListener('click', this.handleClick);

    this.thumbCenterOffsetX = 0;
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    const width = this.value * 100;

    this.barEl.style.width = `${width}%`;
    this.thumbEl.style.left = `calc(${width}% - ${this.thumbWidth / 2}px)`;
    this.containerEl.setAttribute('title', `Volume ${Math.trunc(width)}%`);
  }

  // onVolumeChange = (newValue) => {
  //   this.value = newValue;
  //   const width = this.value * 100;
  //   const thumbWidth = this.thumbEl.getBoundingClientRect().width;

  //   this.barEl.style.width = `${width}%`;
  //   this.thumbEl.style.left = `calc(${width}% - ${thumbWidth / 2}px)`;
  //   this.containerEl.setAttribute('title', `Volume ${Math.trunc(width)}%`);
  // };

  handleClick = (e) => {
    if (e.target.classList.contains(`${this.className}__thumb`)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;
    if (x < rect.left || x > rect.right) {
      return;
    }

    const xInside = e.pageX - rect.x - this.thumbCenterOffsetX;
    this.value = xInside / rect.width;
    this.dispatchEvent(new CustomEvent('volumeChange', { detail: { volume: this.value } }));
  };

  handleMouseMove = (bounds) => (e) => {
    const x = (e.type === 'touchmove' ? e.touches[0].pageX : e.pageX) - this.thumbCenterOffsetX;
    if (x < bounds.left || x > bounds.right) {
      return;
    }

    const xInside = x - bounds.left;
    this.value = xInside / bounds.width;
  };

  handleMouseUp = (e) => {
    if (e.type === 'touchend') {
      document.removeEventListener('touchmove', this.mouseMoveHandler);
      document.removeEventListener('touchend', this.handleMouseUp);
    } else {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
      document.removeEventListener('mouseup', this.handleMouseUp);
    }

    this.isThumbDragged = false;
    this.thumbEl.classList.remove('dragged');
    this.dispatchEvent(new CustomEvent('volumeChange', { detail: { volume: this.value } }));
  };

  handleThumbMouseDown = (e) => {
    e.preventDefault();
    if (this.isThumbDragged) return;
    this.isThumbDragged = true;

    this.thumbCenterOffsetX = e.offsetX - this.thumbWidth / 2;

    const { x, right, width } = this.containerEl.getBoundingClientRect();
    this.mouseMoveHandler = this.handleMouseMove({ left: x, right, width });

    if (e.type === 'touchstart') {
      document.addEventListener('touchmove', this.mouseMoveHandler);
      document.addEventListener('touchend', this.handleMouseUp);
    } else {
      document.addEventListener('mousemove', this.mouseMoveHandler);
      document.addEventListener('mouseup', this.handleMouseUp);
    }

    this.thumbEl.classList.add('dragged');
  };
}

import config from './config';
import { resources } from './resources';

const colors = [
  ,
  '#00418d',
  '#00ba71',
  '#f43545',
  '#5f2879',
  '#ff8901',
  '#00c2de',
  '#fad717',
  'teal',
];

export default class Cell extends EventTarget {
  constructor(key, x, y) {
    super();
    const { cellSize } = config;
    this.left = x;
    this.right = x + cellSize;
    this.top = y;
    this.bottom = y + cellSize;

    this.state = Cell.STATE_CLOSED;
    this.value = Cell.VALUE_EMPTY;
    this.key = key;
  }

  draw = (ctx) => {
    const { top, left, bgColor } = this;
    const { cellSize } = config;
    // ctx.fillStyle = bgColor;
    // ctx.fillRect(left, top, cellSize, cellSize);
    ctx.drawImage(this.getDrawStateImage(), left, top, cellSize, cellSize);

    if (this.state !== Cell.STATE_OPENED) return;

    const value = this.getDrawValue();
    if (value === null) return;
    if (value instanceof Image) {
      ctx.drawImage(value, left + 2, top + 2, cellSize - 4, cellSize - 4);
    } else {
      ctx.fillStyle = colors[this.value];
      ctx.font = '14px "Martian Mono"';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(value, left + cellSize / 2, top + cellSize / 2 + 2);
    }
  };

  getDrawStateImage = () => {
    switch (this.state) {
      case Cell.STATE_CLOSED:
        return resources.closed;
      case Cell.STATE_OPENED:
        return resources.opened;
      case Cell.STATE_FLAGGED:
        return resources.flagged;
    }
  };

  getDrawValue = () => {
    if (this.value === Cell.VALUE_MINE) return resources.mine;
    if (this.value === Cell.VALUE_EMPTY) return null;
    return this.value;
  };

  getKey() {
    return this.key.value;
  }

  get state() {
    return this._state;
  }

  set state(newState) {
    if (newState === Cell.STATE_OPENED) {
      if (this.value === Cell.VALUE_MINE) {
        // this.emit('mineopen', this);
        this.dispatchEvent(new CustomEvent('mineopen', { detail: { cell: this } }));
      }
      {
        // this.emit('cellopen', this);
        this.dispatchEvent(new CustomEvent('cellopen', { detail: { cell: this } }));
      }
    }

    this._state = newState;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
  }

  get isOpened() {
    return this._state === Cell.STATE_OPENED;
  }

  get isClosed() {
    return this._state === Cell.STATE_CLOSED;
  }

  get isFlagged() {
    return this._state === Cell.STATE_FLAGGED;
  }

  get isNumber() {
    return Cell.isNumberValue(this._value);
  }

  get isEmpty() {
    return this._value === Cell.VALUE_EMPTY;
  }

  get isMined() {
    return this._value === Cell.VALUE_MINE;
  }
}

Cell.isNumberValue = (value) => {
  return value > 0 && value <= 8;
};

Cell.STATE_CLOSED = 0;
Cell.STATE_OPENED = 1;
Cell.STATE_FLAGGED = 2;
Cell.VALUE_EMPTY = 0;
Cell.VALUE_MINE = 9;
Cell.VALUE_N_1 = 1;
Cell.VALUE_N_2 = 2;
Cell.VALUE_N_3 = 3;
Cell.VALUE_N_4 = 4;
Cell.VALUE_N_5 = 5;
Cell.VALUE_N_6 = 6;
Cell.VALUE_N_7 = 7;
Cell.VALUE_N_8 = 8;

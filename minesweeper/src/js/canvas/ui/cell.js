import config from '@src/js/config';
import { resources } from '../../resources';
import GameObject from '../game-object';

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

export default class Cell extends GameObject {
  constructor(key, offset) {
    super(offset);
    const { cellSize } = config;
    this.right = offset.x + cellSize;
    this.bottom = offset.y + cellSize;

    this.state = Cell.STATE_CLOSED;
    this.value = Cell.VALUE_EMPTY;
    this.key = key;
  }

  draw(ctx) {
    const {
      offset: { x, y },
      bgColor,
    } = this;
    const { cellSize } = config;
    ctx.drawImage(this.getDrawStateImage(), x, y, cellSize, cellSize);

    if (this.state !== Cell.STATE_OPENED) return;

    const value = this.getDrawValue();
    if (value === null) return;
    if (value instanceof Image) {
      ctx.drawImage(value, x + 2, y + 2, cellSize - 4, cellSize - 4);
    } else {
      ctx.fillStyle = colors[this.value];
      ctx.fillText(value, x + cellSize / 2, y + cellSize / 2 + 2);
    }
  }

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
        this.dispatchEvent(new CustomEvent('mineopen', { detail: { cell: this } }));
      }
      {
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

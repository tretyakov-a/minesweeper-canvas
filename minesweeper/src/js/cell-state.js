export default class CellState extends EventTarget {
  constructor(key) {
    super();

    this.status = CellState.STATUS.CLOSED;
    this.value = CellState.VALUE.EMPTY;
    this.key = key;
  }

  getKey() {
    return this.key.value;
  }

  get status() {
    return this._state;
  }

  set status(newState) {
    if (newState === CellState.STATUS.OPENED) {
      if (this.value === CellState.VALUE.MINE) {
        this.dispatchEvent(new CustomEvent('mineopen', { detail: { cell: this } }));
      } else {
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
    return this._state === CellState.STATUS.OPENED;
  }

  get isClosed() {
    return this._state === CellState.STATUS.CLOSED;
  }

  get isFlagged() {
    return this._state === CellState.STATUS.FLAGGED;
  }

  get isNumber() {
    return CellState.isNumberValue(this._value);
  }

  get isEmpty() {
    return this._value === CellState.VALUE.EMPTY;
  }

  get isMined() {
    return this._value === CellState.VALUE.MINE;
  }
}

CellState.isNumberValue = (value) => value > 0 && value <= 8;

CellState.STATUS = {
  CLOSED: 0,
  OPENED: 1,
  FLAGGED: 2,
};

CellState.VALUE = {
  EMPTY: 0,
  MINE: 9,
  N_1: 1,
  N_2: 2,
  N_3: 3,
  N_4: 4,
  N_5: 5,
  N_6: 6,
  N_7: 7,
  N_8: 8,
};

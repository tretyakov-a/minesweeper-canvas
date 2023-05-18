export default class CellState extends EventTarget {
  constructor(key) {
    super();

    this.status = CellState.STATUS.CLOSED;
    this.value = CellState.VALUE.EMPTY;
    this.key = key;
    this.borders = [];
    this.isHighlighted = false;
    this.errorHighlighted = false;
  }

  getKey() {
    return this.key.value;
  }

  get isHighlighted() {
    return this._isHighlighted;
  }

  set isHighlighted(value) {
    this._isHighlighted = value;
    this.dispatchEvent(new CustomEvent('stateChange'));
  }

  get errorHighlighted() {
    return this._errorHighlighted;
  }

  set errorHighlighted(value) {
    this._errorHighlighted = value;
    this.dispatchEvent(new CustomEvent('stateChange'));
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    this.dispatchEvent(new CustomEvent('statusChange', { detail: { cell: this } }));
    this.dispatchEvent(new CustomEvent('stateChange'));
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
  }

  get isOpened() {
    return this._status === CellState.STATUS.OPENED;
  }

  get isClosed() {
    return this._status === CellState.STATUS.CLOSED;
  }

  get isFlagged() {
    return this._status === CellState.STATUS.FLAGGED;
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

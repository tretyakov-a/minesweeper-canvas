import config from '@src/js/config';
import { STATUS } from '@src/js/constants';
import { randomNumber } from './helpers';
import Cell from './canvas/ui/cell';
import CellKey from './cell-key';
import Point from './canvas/point';

const checks = {
  topLeft: [-1, -1],
  top: [-1, 0],
  topRight: [-1, 1],
  left: [0, -1],
  right: [0, 1],
  bottomLeft: [1, -1],
  bottom: [1, 0],
  bottomRight: [1, 1],
};

class GameState extends EventTarget {
  constructor(difficulty) {
    super();
    this.difficulty = difficulty;
    this.flagsCounter = this.difficulty.mines;
    this.cellsToOpenAmount = 0;
    this.cellsOpenedCounter = 0;
  }

  set flagCounter(value) {
    this._flagCounter = value;
    this.dispatchEvent(
      new CustomEvent('flagCounterChanged', { detail: { status: this._flagCounter } })
    );
  }

  get flagCounter() {
    return this._flagCounter;
  }

  set status(value) {
    this._status = value;
    this.dispatchEvent(new CustomEvent('statusChanged', { detail: { status: this._status } }));
  }

  get status() {
    return this._status;
  }

  getCell = (cellKey) => {
    if (!this._checkCell(cellKey)) {
      return undefined;
    }
    return this.state[cellKey.x][cellKey.y];
  };

  _checkCell = (cellKey) =>
    this.state[cellKey.x] !== undefined && this.state[cellKey.x][cellKey.y] !== undefined;

  flagCell = (cellKey) => {
    const cell = this.getCell(cellKey);
    if (cell.isOpened) {
      return this.flagsCounter;
    }
    if (cell.isFlagged) {
      this.flagsCounter += 1;
      cell.state = Cell.STATE_CLOSED;
    } else {
      this.flagsCounter -= 1;
      cell.state = Cell.STATE_FLAGGED;
    }

    return this.flagsCounter;
  };

  openCell = (cellKey) => {
    const cell = this.getCell(cellKey);
    if (cell.isFlagged || (cell.isOpened && (cell.isMined || cell.isEmpty))) {
      return;
    }

    if (cell.isOpened && cell.isNumber) {
      const cells = this.getHighlightedCells(cellKey);
      if (cells.length === 0 || cell.value > this.countFlagsAround(cellKey)) {
        return;
      }
      cells.forEach(this.openCell);
      return;
    }

    cell.state = Cell.STATE_OPENED;

    if (cell.isEmpty) {
      this._revealEmptySpace(cellKey);
    }
  };

  revealCell = (cellKey) => {
    if (this.status === STATUS.IDLE) {
      this.status = STATUS.RUNNING;
      this.generateState(cellKey);
    }
    this.openCell(cellKey);
  };

  openAll = () => {
    for (let rowIdx = 0; rowIdx < this.state.length; rowIdx += 1) {
      for (let colIdx = 0; colIdx < this.state[rowIdx].length; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        const cell = this.getCell(cellKey);
        if (!cell.isFlagged && cell.isClosed) {
          cell.state = Cell.STATE_OPENED;
        }
      }
    }
  };

  handleCellOpen = (e) => {
    if (this.status !== STATUS.RUNNING) {
      return;
    }

    this.cellsOpenedCounter += 1;
    if (this.cellsOpenedCounter === this.cellsToOpenAmount) {
      this.status = STATUS.STOPPED;
      this.openAll();
      this.dispatchEvent(new CustomEvent('win'));
    }
  };

  handleLose = (e) => {
    if (this.status !== STATUS.RUNNING) {
      return;
    }
    this.status = STATUS.STOPPED;
    this.openAll();
    this.dispatchEvent(
      new CustomEvent('lose', {
        detail: {
          mineKey: e.detail.cell.key,
          wrongFlagsKeys: this._findWrongFlags(),
        },
      })
    );
  };

  countFlagsAround = (cellKey) =>
    Object.values(checks).reduce((counter, [dx, dy]) => {
      const newCellKey = new CellKey(cellKey.x + dx, cellKey.y + dy);
      const cell = this.getCell(newCellKey);
      return counter + (cell ? cell.isFlagged : 0);
    }, 0);

  getHighlightedCells = (cellKey) =>
    Object.values(checks).reduce((cells, [dx, dy]) => {
      const newCellKey = new CellKey(cellKey.x + dx, cellKey.y + dy);
      const cell = this.getCell(newCellKey);
      if (cell && cell.isClosed) {
        cells.push(newCellKey);
      }
      return cells;
    }, []);

  generateState = (cellKey) => {
    this._generateMines(cellKey);
    this._generateNumbers();
  };

  reset = (newDifficulty) => {
    if (newDifficulty !== undefined) {
      this.difficulty = newDifficulty;
    }
    this.status = STATUS.IDLE;
    this.flagsCounter = this.difficulty.mines;
    this.cellsToOpenAmount = 0;
    this.cellsOpenedCounter = 0;
    this.cellKeys = [];
    this.state = this._generateInitialMatrix();
  };

  _findWrongFlags = () => {
    const wrongFlagsKeys = [];
    for (let rowIdx = 0; rowIdx < this.state.length; rowIdx += 1) {
      for (let colIdx = 0; colIdx < this.state[rowIdx].length; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        const cell = this.getCell(cellKey);
        if (cell.isFlagged && !cell.isMined) {
          wrongFlagsKeys.push(cellKey);
        }
      }
    }
    return wrongFlagsKeys;
  };

  _revealEmptySpace = (cellKey) => {
    const reveal = (key, cellKey) => {
      const [dx, dy] = checks[key];
      const newCellKey = new CellKey(cellKey.x + dx, cellKey.y + dy);

      const cell = this.getCell(newCellKey);
      if (!cell || cell.isOpened || cell.isFlagged) {
        return;
      }
      if (cell.isNumber) {
        cell.state = Cell.STATE_OPENED;
        return;
      }
      if (cell.isEmpty) {
        cell.state = Cell.STATE_OPENED;
        Object.keys(checks).forEach((checkKey) => reveal(checkKey, newCellKey));
      }
    };

    Object.keys(checks).forEach((key) => reveal(key, cellKey));
  };

  _generateInitialMatrix = () => {
    const { borderWidth, headerHeight, cellSize } = config;
    const { width, height } = this.difficulty;
    const matrix = [];
    for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
      matrix.push(new Array(width).fill(null));
      for (let colIdx = 0; colIdx < width; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        const x = borderWidth + colIdx * borderWidth + colIdx * cellSize;
        const y = borderWidth + rowIdx * borderWidth + rowIdx * cellSize + headerHeight;
        this.cellKeys.push(cellKey);
        matrix[rowIdx][colIdx] = new Cell(cellKey, new Point(x, y));
      }
    }
    return matrix;
  };

  _generateMines = (excludedCellKey) => {
    const { mines: minesNumber, width, height } = this.difficulty;
    const mines = {};
    for (let k = 0; k < minesNumber; k += 1) {
      let newCellKey;
      do {
        newCellKey = new CellKey(randomNumber(0, height), randomNumber(0, width));
      } while (mines[newCellKey.value] || newCellKey.value === excludedCellKey.value);
      mines[newCellKey.value] = 1;
      const cell = this.getCell(newCellKey);
      cell.value = Cell.VALUE_MINE;
      cell.addEventListener('mineopen', this.handleLose);
    }
  };

  _countNeighboringMines = (cellKey) =>
    Object.values(checks).reduce((counter, [dx, dy]) => {
      const newCellKey = new CellKey(cellKey.x + dx, cellKey.y + dy);
      const cell = this.getCell(newCellKey);
      return counter + (cell ? cell.isMined : 0);
    }, 0);

  _generateNumbers = () => {
    for (let rowIdx = 0; rowIdx < this.state.length; rowIdx += 1) {
      for (let colIdx = 0; colIdx < this.state[rowIdx].length; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        const cell = this.getCell(cellKey);
        if (!cell.isMined) {
          this.cellsToOpenAmount += 1;
          const value = this._countNeighboringMines(cellKey);
          cell.value = value;
          cell.addEventListener('cellopen', this.handleCellOpen);
        }
      }
    }
  };
}

console.log('GAME STATE CREATED');

const gameState = new GameState(config.difficulty);
export default gameState;

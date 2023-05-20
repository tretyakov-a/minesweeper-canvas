import { STATUS, RESULT, DIFFICULTY, THEME } from '@src/js/constants';
import { randomNumber } from './helpers';
import CellKey from './cell-key';
import CellState from './cell-state';
import difficulty from './difficulty';

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

const defaultClicks = {
  left: 0,
  right: 0,
  wasted: 0,
  chords: 0,
};

class GameState extends EventTarget {
  constructor(difficultyKey = DIFFICULTY.EASY) {
    super();
    this.difficultyKey = difficultyKey;
    this.isDifficultyChanged = true;
    this.numOfMines = difficulty[this.difficultyKey].mines;
    this.cellsToOpenAmount = 0;
    this.cellsOpenedCounter = 0;
    this.clicks = { ...defaultClicks };
    this.clicksCounter = 0;

    this.isMouseDown = false;
    this.highlighted = {
      targetKey: null,
      cellKeys: [],
    };
    this.theme = THEME.LIGHT;
  }

  get theme() {
    return this._theme;
  }

  set theme(value) {
    this._theme = value;
    this.dispatchEvent(new CustomEvent('themeChange'));
  }

  get numOfMines() {
    return this._numOfMines;
  }

  set numOfMines(value) {
    this._numOfMines = value;
    this.flagsCounter = value;
  }

  unhighlightCells = () => {
    if (this.highlighted.cellKeys.length === 0) return;
    for (const key of this.highlighted.cellKeys) {
      this.getCell(key).isHighlighted = false;
    }
    this.highlighted = {
      targetKey: null,
      cellKeys: [],
    };
  };

  highlightCells = (cellKey) => {
    const { isOpened } = this.getCell(cellKey);
    if (!isOpened) return;
    this.highlighted.targetKey = cellKey;
    this.highlighted.cellKeys = this.getHighlightedCells(cellKey);
    for (const key of this.highlighted.cellKeys) {
      this.getCell(key).isHighlighted = true;
    }
  };

  set clicksCounter(value) {
    this.clicks.left = value;
    this.dispatchEvent(
      new CustomEvent('clicksCounterChange', { detail: { amount: this.clicks.left } })
    );
  }

  get clicksCounter() {
    return this.clicks.left;
  }

  set flagsCounter(value) {
    this._flagsCounter = value;
    this.dispatchEvent(
      new CustomEvent('flagsCounterChange', { detail: { amount: this._flagsCounter } })
    );
  }

  get flagsCounter() {
    return this._flagsCounter;
  }

  set status(value) {
    this._status = value;
    this.dispatchEvent(new CustomEvent('statusChange', { detail: { status: this._status } }));
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

  startGame = (cellKey) => {
    if (this.status === STATUS.IDLE) {
      this.status = STATUS.RUNNING;
      this.generateState(cellKey);
    }
  };

  flagCell = (cellKey) => {
    this.startGame(cellKey);

    this.clicks.right += 1;

    const cell = this.getCell(cellKey);
    if (cell.isOpened) {
      return this.flagsCounter;
    }
    if (cell.isFlagged) {
      this.flagsCounter += 1;
      cell.status = CellState.STATUS.CLOSED;
    } else {
      this.flagsCounter -= 1;
      cell.status = CellState.STATUS.FLAGGED;
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
        // wasted click
        this.clicks.wasted += 1;
        return;
      }
      // chord
      this.clicks.chords += 1;
      cells.forEach(this.openCell);
      return;
    }

    cell.status = CellState.STATUS.OPENED;

    if (cell.isEmpty) {
      this._revealEmptySpace(cellKey);
    }
  };

  revealCell = (cellKey) => {
    this.startGame(cellKey);
    this.openCell(cellKey);
  };

  openAll = () => {
    for (let rowIdx = 0; rowIdx < this.state.length; rowIdx += 1) {
      for (let colIdx = 0; colIdx < this.state[rowIdx].length; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        const cell = this.getCell(cellKey);
        if (!cell.isFlagged && cell.isClosed) {
          cell.status = CellState.STATUS.OPENED;
        }
      }
    }
  };

  handleCellStatusChange = (e) => {
    if (this.status !== STATUS.RUNNING) {
      return;
    }
    const { cell } = e.detail;
    if (cell.isOpened) this.handleCellOpen(cell);
  };

  handleCellOpen = (cellState) => {
    if (cellState.isMined) return this.handleLose(cellState);

    this.cellsOpenedCounter += 1;
    if (this.cellsOpenedCounter === this.cellsToOpenAmount) {
      this.status = STATUS.STOPPED;
      this.openAll();
      this.result = RESULT.WIN;
      this.dispatchEvent(new CustomEvent('gameOver', { detail: { result: RESULT.WIN } }));
    }
  };

  highlightErrors = (mineKey) => {
    for (const cellKey of [mineKey, ...this._findWrongFlags()]) {
      this.getCell(cellKey).errorHighlighted = true;
    }
  };

  handleLose = (cellState) => {
    this.status = STATUS.STOPPED;
    this.openAll();
    this.highlightErrors(cellState.key);
    this.result = RESULT.LOSS;
    this.dispatchEvent(new CustomEvent('gameOver', { detail: { result: RESULT.LOSS } }));
  };

  getGameResult = () => {
    if (this.status !== STATUS.STOPPED) return null;
    const { result, time, clicks } = this;
    return {
      difficulty: this.difficultyKey,
      result,
      time,
      clicks,
    };
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

  reset = (newDifficulty, isCustom = false) => {
    this.isCustom = isCustom;
    this.isDifficultyChanged = false;
    if (newDifficulty !== undefined) {
      this.isDifficultyChanged = this.difficultyKey !== newDifficulty;
      this.difficultyKey = newDifficulty;
    }
    this.flagsCounter = this.numOfMines;
    this.clicksCounter = 0;
    this.clicks = { ...defaultClicks };
    this.cellsToOpenAmount = 0;
    this.cellsOpenedCounter = 0;
    this.result = null;
    this.cellKeys = [];
    this.state = this._generateInitialMatrix();
    this.status = STATUS.IDLE;
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
        cell.status = CellState.STATUS.OPENED;
        return;
      }
      if (cell.isEmpty) {
        cell.status = CellState.STATUS.OPENED;
        Object.keys(checks).forEach((checkKey) => reveal(checkKey, newCellKey));
      }
    };

    Object.keys(checks).forEach((key) => reveal(key, cellKey));
  };

  _generateInitialMatrix = () => {
    const { width, height } = difficulty[this.difficultyKey];
    const matrix = [];
    for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
      matrix.push(new Array(width).fill(null));
      for (let colIdx = 0; colIdx < width; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        this.cellKeys.push(cellKey);
        const cell = new CellState(cellKey);
        cell.addEventListener('statusChange', this.handleCellStatusChange);
        matrix[rowIdx][colIdx] = cell;
      }
    }
    return matrix;
  };

  _generateMines = (excludedCellKey) => {
    const { width, height } = difficulty[this.difficultyKey];
    const mines = {};
    for (let k = 0; k < this.numOfMines; k += 1) {
      let newCellKey;
      do {
        newCellKey = new CellKey(randomNumber(0, height - 1), randomNumber(0, width - 1));
      } while (mines[newCellKey.value] || newCellKey.value === excludedCellKey.value);
      mines[newCellKey.value] = 1;
      const cell = this.getCell(newCellKey);
      cell.value = CellState.VALUE.MINE;
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
        }
      }
    }
  };
}

const gameState = new GameState();
export default gameState;

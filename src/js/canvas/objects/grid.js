import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { MOUSE, RESOURCES, RESULT } from '@src/js/constants';
import Cell from './cell';
import { gameObjectOptions } from '../core/utils';
import CachedGameObject from '../core/cached-game-object';
import Explosion from './explosion';
import { resources } from '@src/js/resources';
import Point from '../core/point';

const cellName = (row, col) => `cell/${row}-${col}`;

export default class Grid extends CachedGameObject {
  constructor(...props) {
    super(...props);

    this.addCells();
    this.add(
      'explosion',
      Explosion,
      gameObjectOptions(50, 50),
      resources.getImage(RESOURCES.EXPLOSION),
      new Point(4, 4)
    );
    this.addEventListener('mousedown', this.handleMouseDown);
    this.setCursor('pointer');
    gameState.addEventListener('gameOver', this.handleGameOver);
  }

  destroy() {
    gameState.removeEventListener('gameOver', this.handleGameOver);
    super.destroy();
  }

  handleGameOver = (e) => {
    const { result } = e.detail;
    if (result === RESULT.LOSS) {
      const { mine } = e.detail;
      const {
        offset: { x, y },
        width,
        height,
      } = this.get(cellName(mine.x, mine.y));
      const exp = this.get('explosion');

      exp.play(new Point(x - (exp.width - width) / 2, y - (exp.height - height) / 2));
    }
  };

  handleMouseDown = (e) => {
    gameState.isMouseDown = e.detail.button === MOUSE.LEFT;

    if (gameState.isMouseDown) {
      document.addEventListener('mouseup', this.documentMouseUp);
    }
  };

  documentMouseUp = (e) => {
    document.removeEventListener('mouseup', this.documentMouseUp);
    gameState.isMouseDown = false;
  };

  addCells = () => {
    const { getCellSize } = config;
    const cellSize = getCellSize(gameState.difficultyKey);
    const { cellKeys } = gameState;
    for (const cellKey of cellKeys) {
      const cellState = gameState.getCell(cellKey);
      const { x: row, y: col } = cellKey;
      const x = col * cellSize;
      const y = row * cellSize;
      this.add(cellName(row, col), Cell, gameObjectOptions(x, y, cellSize, cellSize), cellState);
    }
  };

  update(deltaTime) {
    this.isChange = this.get('explosion').update(deltaTime);
  }

  reset() {
    if (!gameState.isDifficultyChanged) {
      super.reset();
    }
  }

  checkMousePosition(e, onContains) {
    const { offsetX, offsetY } = e.detail;
    const { getCellSize, headerHeight } = config;
    const cellSize = getCellSize(gameState.difficultyKey);
    const row = Math.floor((offsetY - headerHeight) / cellSize);
    const col = Math.floor(offsetX / cellSize);
    const key = cellName(row, col);
    const obj = this.objects.get(key);
    if (obj !== undefined && offsetX >= obj.offset.x && offsetY >= obj.offset.y) {
      onContains(obj, key);
      return true;
    }
    return false;
  }

  draw(ctx) {
    this.drawCached(ctx, null, this.isChanged);
  }
}

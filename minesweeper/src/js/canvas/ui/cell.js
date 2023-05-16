import config from '@src/js/config';
import gameState from '@src/js/game-state';
import CellState from '@src/js/cell-state';
import { MOUSE } from '@src/js/constants';
import { resources } from '@src/js/resources';
import GameObject from '../game-object';
import theme from '../theme';

export default class Cell extends GameObject {
  constructor(options, state) {
    const { cellSize } = config;
    super({ ...options, width: cellSize, height: cellSize });

    this.state = state;

    this.addEventListener('mousedown', this.handleMouseDown);
    this.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown = (e) => {
    if (e.button === MOUSE.RIGHT) {
      return gameState.flagCell(this.state.key);
    }
    document.addEventListener('mouseup', this.documentMouseUp);
    gameState.isMouseDown = e.button === MOUSE.LEFT;
  };

  documentMouseUp = (e) => {
    document.removeEventListener('mouseup', this.documentMouseUp);
    gameState.isMouseDown = false;
  };

  handleMouseUp = (e) => {
    if (e.button === MOUSE.LEFT) {
      return gameState.revealCell(this.state.key);
    }
  };

  draw(ctx) {
    const { width, height } = this;

    this.drawWithOffset(ctx, () => {
      // const img =
      //   this.isHovered && gameState.isMouseDown ? resources.opened : this.getDrawStateImage();
      // ctx.drawImage(img, 0, 0, width, height);
      const color =
        this.isHovered && gameState.isMouseDown && !this.state.isOpened
          ? theme.cellBg.opened
          : this.getDrawStateColor();
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);

      if (this.state.status !== CellState.STATUS.OPENED) return;

      const value = this.getDrawValue();
      if (value === null) return;
      if (value instanceof Image) {
        ctx.drawImage(value, 2, 2, width - 4, height - 4);
      } else {
        ctx.fillStyle = theme.cellText[this.state.value];
        ctx.fillText(value, width / 2, height / 2 + 2);
      }
    });
  }

  getDrawStateColor = () => {
    switch (this.state.status) {
      case CellState.STATUS.CLOSED:
        return theme.cellBg.closed;
      case CellState.STATUS.OPENED:
        return theme.cellBg.opened;
      case CellState.STATUS.FLAGGED:
        return theme.cellBg.flagged;
      default:
        return theme.cellBg.closed;
    }
  };

  getDrawStateImage = () => {
    switch (this.state.status) {
      case CellState.STATUS.CLOSED:
        return resources.closed;
      case CellState.STATUS.OPENED:
        return resources.opened;
      case CellState.STATUS.FLAGGED:
        return resources.flagged;
      default:
        return resources.closed;
    }
  };

  getDrawValue = () => {
    if (this.state.isMined) return resources.mine;
    if (this.state.isEmpty) return null;
    return this.state.value;
  };
}

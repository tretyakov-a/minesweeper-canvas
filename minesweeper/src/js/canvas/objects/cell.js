import config from '@src/js/config';
import gameState from '@src/js/game-state';
import CellState from '@src/js/cell-state';
import { MOUSE, STATUS } from '@src/js/constants';
import { RESOURCES } from '@src/js/resources';
import theme from '@src/js/theme';
import CachedGameObject from '../core/cached-game-object';
import ImageObject from './image-object';

export default class Cell extends CachedGameObject {
  constructor(options, state) {
    const { cellSize } = config;
    super({ ...options, width: cellSize, height: cellSize });

    this.state = state;

    this.addEventListener('mousedown', this.handleMouseDown);
    this.addEventListener('mouseup', this.handleMouseUp);
    this.addEventListener('mouseenter', this.handleMouseEnter);
    this.addEventListener('mouseleave', this.handleMouseLeave);
    gameState.addEventListener('statusChange', this.handleGameStatusChange);
    this.state.addEventListener('statusChange', this.handleCellStatusChange);
    this.state.addEventListener('stateChange', this.handleCellStateChange);
  }

  handleCellStateChange = () => {
    this.isChanged = true;
  };

  handleCellStatusChange = () => {
    const { isOpened, isClosed, isFlagged, isMined } = this.state;
    if (isFlagged) {
      this.add('flag', ImageObject, {}, RESOURCES.FLAG, config.flagSize);
    } else if (isClosed) {
      this.remove('flag');
    }

    if (isOpened && isMined) {
      this.add('mine', ImageObject, {}, RESOURCES.MINE, config.mineSize);
    }
  };

  handleGameStatusChange = (e) => {
    const { status } = e.detail;
    if (status === STATUS.STOPPED) {
      this.removeEventListener('mousedown', this.handleMouseDown);
      this.removeEventListener('mouseup', this.handleMouseUp);
      this.removeEventListener('mouseenter', this.handleMouseEnter);
      this.removeEventListener('mouseleave', this.handleMouseLeave);
    }
  };

  handleMouseEnter = () => {
    if (gameState.isMouseDown) gameState.highlightCells(this.state.key);
  };

  handleMouseLeave = () => {
    if (gameState.isMouseDown) gameState.unhighlightCells();
  };

  handleMouseDown = (e) => {
    if (e.detail.button === MOUSE.LEFT) {
      gameState.highlightCells(this.state.key);
    }
    if (e.detail.button === MOUSE.RIGHT) {
      return gameState.flagCell(this.state.key);
    }
  };

  handleMouseUp = (e) => {
    gameState.unhighlightCells();
    if (e.detail.button === MOUSE.LEFT) {
      return gameState.revealCell(this.state.key);
    }
  };

  drawClosedBorders = (ctx) => {
    const { width, height } = this;
    const { borders } = this.state;
    ctx.strokeStyle = theme.flagColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    borders.forEach((border) => {
      switch (border) {
        case 'top':
          ctx.moveTo(0, 0);
          ctx.lineTo(width, 0);
          break;
        case 'right':
          ctx.moveTo(width, 0);
          ctx.lineTo(width, height);
          break;
        case 'bottom':
          ctx.moveTo(0, height);
          ctx.lineTo(width, height);
          break;
        case 'left':
          ctx.moveTo(0, 0);
          ctx.lineTo(0, height);
          break;
      }
    });
    ctx.stroke();
  };

  drawBorders = (ctx) => {
    const { width, height } = this;
    ctx.strokeStyle = theme.bgColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.stroke();
  };

  drawValue = (ctx) => {
    const { width, height } = this;
    const { value, isNumber, isEmpty } = this.state;
    if (!isNumber || isEmpty) return;

    ctx.fillStyle = theme.cellTextColor[this.state.value];
    ctx.fillText(value, width / 2, height / 2 + 2);
  };

  drawBackground = (ctx) => {
    const { width, height } = this;
    const { isOpened, isFlagged, isHighlighted, errorHighlighted } = this.state;
    let bgColor =
      this.isHovered && gameState.isMouseDown && !isOpened && !isFlagged
        ? theme.cellBg.opened
        : this.getDrawStateBgColor();

    let hightlightColor = null;
    if ((this.isHovered && !isOpened) || isHighlighted) hightlightColor = theme.cellBg.hightlight;
    if (errorHighlighted) hightlightColor = theme.cellBg.error;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    if (hightlightColor !== null) {
      ctx.fillStyle = hightlightColor;
      ctx.fillRect(0, 0, width, height);
    }
  };

  drawCell = (ctx) => {
    this.drawBackground(ctx);
    this.drawBorders(ctx);

    if (this.state.isOpened) this.drawValue(ctx);
  };

  draw(ctx) {
    this.drawCached(ctx, (cachedContext) => {
      this.drawCell(cachedContext);
      super.draw(cachedContext);
    });
  }

  getDrawStateBgColor = () => {
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
}

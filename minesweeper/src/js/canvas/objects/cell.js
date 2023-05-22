import config from '@src/js/config';
import gameState from '@src/js/game-state';
import CellState from '@src/js/cell-state';
import { MOUSE, STATUS } from '@src/js/constants';
import { RESOURCES } from '@src/js/constants';
import { settings } from '@src/js/game-env/settings';
import theme from '@src/js/theme';
import CachedGameObject from '../core/cached-game-object';
import ImageObject from './image-object';
import { applyBg } from '../core/utils';

export default class Cell extends CachedGameObject {
  constructor(options, state) {
    super(options);

    this.state = state;

    this.setListeners();
    gameState.addEventListener('statusChange', this.handleGameStatusChange);
  }

  destroy() {
    gameState.removeEventListener('statusChange', this.handleGameStatusChange);
    this.state.removeEventListener('statusChange', this.handleCellStatusChange);
    this.state.removeEventListener('stateChange', this.handleCellStateChange);
    super.destroy();
  }

  setListeners() {
    this.addEventListener('mousedown', this.handleMouseDown);
    this.addEventListener('mouseup', this.handleMouseUp);
    this.addEventListener('mouseenter', this.handleMouseEnter);
    this.addEventListener('mouseleave', this.handleMouseLeave);
    this.state.addEventListener('statusChange', this.handleCellStatusChange);
    this.state.addEventListener('stateChange', this.handleCellStateChange);
  }

  reset() {
    this.state = gameState.getCell(this.state.key);
    this.setListeners();
    this.isChanged = true;
    this.objects.clear();
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
      gameState.clicksCounter += 1;
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

  drawBorders(ctx) {
    const { width, height } = this;
    ctx.strokeStyle = theme[settings.theme].borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.stroke();
  }

  drawValue(ctx) {
    const { width, height } = this;
    const { value, isNumber, isEmpty } = this.state;
    if (!isNumber || isEmpty) return;

    ctx.fillStyle = theme[settings.theme].cellTextColor[this.state.value];
    ctx.fillText(value, width / 2, height / 2 + 2);
  }

  drawBackground(ctx) {
    const { width, height } = this;
    const { isOpened, isFlagged, isHighlighted, errorHighlighted } = this.state;
    let bgColor =
      this.isHovered && gameState.isMouseDown && !isOpened && !isFlagged
        ? theme[settings.theme].cellBg.opened
        : this.getDrawStateBgColor();

    let hightlightColor = null;
    if ((this.isHovered && !isOpened) || isHighlighted)
      hightlightColor = theme[settings.theme].cellBg.hightlight;
    if (errorHighlighted) hightlightColor = theme[settings.theme].cellBg.error;

    applyBg.call(this, ctx, bgColor);

    if (hightlightColor !== null) {
      applyBg.call(this, ctx, hightlightColor);
    }
  }

  drawCell(ctx) {
    this.drawBackground(ctx);
    this.drawBorders(ctx);

    if (this.state.isOpened) this.drawValue(ctx);
  }

  draw(ctx) {
    this.drawCached(ctx, (cacheCtx) => {
      this.drawCell(cacheCtx);
      super.draw(cacheCtx);
    });
  }

  getDrawStateBgColor() {
    switch (this.state.status) {
      case CellState.STATUS.CLOSED:
        return theme[settings.theme].cellBg.closed;
      case CellState.STATUS.OPENED:
        return theme[settings.theme].cellBg.opened;
      case CellState.STATUS.FLAGGED:
        return theme[settings.theme].cellBg.flagged;
      default:
        return theme[settings.theme].cellBg.closed;
    }
  }
}

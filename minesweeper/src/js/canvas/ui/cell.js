import config from '@src/js/config';
import gameState from '@src/js/game-state';
import CellState from '@src/js/cell-state';
import { MOUSE, STATUS } from '@src/js/constants';
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
    this.addEventListener('mouseenter', this.handleMouseEnter);
    this.addEventListener('mouseleave', this.handleMouseLeave);
    gameState.addEventListener('statusChanged', this.handleGameStatusChange);
  }

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
    gameState.highlightCells(this.state.key);
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

  drawCross = (ctx, widthPart = 0.6) => {
    const { width, height } = this;
    const padding = (width * (1 - widthPart)) / 2;
    ctx.strokeStyle = theme.flagColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(width - padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
  };

  drawBorders(ctx) {
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
  }

  draw(ctx) {
    const { width, height } = this;

    this.drawWithOffset(
      ctx,
      () => {
        // const img =
        //   this.isHovered && gameState.isMouseDown ? resources.opened : this.getDrawStateImage();
        // ctx.drawImage(img, 0, 0, width, height);
        const { isOpened, isFlagged, isHighlighted, errorHighlighted } = this.state;
        let color =
          this.isHovered && gameState.isMouseDown && !isOpened && !isFlagged
            ? theme.cellBg.opened
            : this.getDrawStateBgColor();
        if (errorHighlighted) color = theme.cellBg.error;

        let hightlightColor = null;
        if ((this.isHovered && !isOpened) || isHighlighted) hightlightColor = `rgba(0, 0, 0, 0.1)`;

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);

        if (hightlightColor !== null) {
          ctx.fillStyle = hightlightColor;
          ctx.fillRect(0, 0, width, height);
        }

        if (isFlagged) {
          this.drawCross(ctx);
        }
        // this.drawBorders(ctx);

        ctx.strokeStyle = theme.bgColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.stroke();

        if (!isOpened) return;

        const value = this.getDrawValue();
        if (value === null) return;
        if (value instanceof Image) {
          ctx.drawImage(value, 2, 2, width - 4, height - 4);
        } else {
          ctx.fillStyle = theme.cellText[this.state.value];
          ctx.fillText(value, width / 2, height / 2 + 2);
        }
      },
      0
    );
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

import config from '@src/js/config';
import gameState from '@src/js/game-state';
import GameObject from '../game-object';
import Cell from './cell';
import { options } from '../utils';

export default class Grid extends GameObject {
  constructor(...props) {
    super(...props);

    this.addCells();
  }

  addCells = () => {
    const { borderWidth, cellSize } = config;
    const { cellKeys } = gameState;
    for (const cellKey of cellKeys) {
      const cellState = gameState.getCell(cellKey);
      const { x: row, y: col } = cellKey;
      const x = borderWidth + col * borderWidth + col * cellSize;
      const y = borderWidth + row * borderWidth + row * cellSize;
      this.add(`cell/${row}-${col}`, Cell, options(x, y), cellState);
    }
  };

  reset = () => {
    const { cellKeys } = gameState;
    for (const { x: row, y: col } of cellKeys) {
      this.remove(`cell/${row}-${col}`);
    }
    super.reset();
    this.addCells();
  };

  draw(ctx) {
    const {
      difficulty: { width, height },
      borderWidth,
      cellSize,
    } = config;
    const { clientWidth, clientHeight } = ctx.canvas;

    ctx.strokeStyle = 'grey';
    ctx.lineWidth = borderWidth;

    super.drawWithOffset(ctx, () => {
      ctx.beginPath();
      for (let i = 0; i < width + 1; i += 1) {
        const lineY = cellSize * i + i * borderWidth;
        ctx.moveTo(0, lineY);
        ctx.lineTo(clientWidth, lineY);
      }
      for (let i = 0; i < height + 1; i += 1) {
        const lineX = cellSize * i + i * borderWidth;
        ctx.moveTo(lineX, 0);
        ctx.lineTo(lineX, clientHeight);
      }
      ctx.stroke();
    });
    super.draw(ctx);
  }
}

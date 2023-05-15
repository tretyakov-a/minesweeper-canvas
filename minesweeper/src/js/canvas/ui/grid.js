import config from '@src/js/config';
import GameObject from '../game-object';

export default class Grid extends GameObject {
  constructor(offset) {
    super(offset);
  }

  draw(ctx) {
    const {
      difficulty: { width, height },
      borderWidth,
      cellSize,
    } = config;
    const { clientWidth, clientHeight } = ctx.canvas;

    ctx.strokeStyle = 'grey';
    ctx.lineWidth = borderWidth;

    super.draw(ctx, () => {
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
  }
}

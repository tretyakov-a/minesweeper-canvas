import config from './config';

export default class GameCanvas extends EventTarget {
  constructor(container, cells) {
    super();
    this.cells = cells;
    this.canvas = this.createCanvas(container);
    if (!this.canvas.getContext) {
      throw new Error('Canvas is unsupported');
    }
    this.ctx = this.canvas.getContext('2d');
    this.canvas.addEventListener('mousedown', this.handleCanvasMouseDown);
    this.startGameLoop();
  }

  handleCanvasMouseDown = (e) => {
    const { offsetX: mouseX, offsetY: mouseY } = e;
    this.cells.forEach((cell) => {
      const { top, right, bottom, left } = cell;
      if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
        cell.dispatchEvent(new CustomEvent('mousedown'));
      }
    });
  };

  createCanvas = (container) => {
    const {
      difficulty: { width, height },
      borderWidth,
      cellSize,
    } = config;

    const canvas = document.createElement('canvas');
    canvas.width = cellSize * width + (width + 1) * borderWidth;
    canvas.height = cellSize * height + (height + 1) * borderWidth;
    canvas.id = 'game-canvas';
    container.append(canvas);

    return canvas;
  };

  startGameLoop = () => {
    this.draw();
    requestAnimationFrame(this.draw);
  };

  draw = () => {
    const { ctx } = this;
    const { clientWidth, clientHeight } = ctx.canvas;

    ctx.clearRect(0, 0, clientWidth, clientHeight); // clear canvas
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    this.drawGrid();

    ctx.save();
    this.cells.forEach((cell) => cell.draw(ctx));
    ctx.restore();

    requestAnimationFrame(this.draw);
  };

  drawGrid = () => {
    const {
      difficulty: { width, height },
      borderWidth,
      cellSize,
    } = config;
    const { ctx } = this;
    const { clientWidth, clientHeight } = ctx.canvas;

    ctx.save();
    ctx.translate(0.5, 0.5);
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
    ctx.restore();
  };
}

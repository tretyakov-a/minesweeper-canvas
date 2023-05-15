import config from '../config';
import gameState from '../game-state';
import GameObject from './game-object';
import Point from './point';
import Grid from './ui/grid';
import Timer from './ui/timer';

const MOUSE = {
  LEFT: 0,
  RIGHT: 2,
};

export default class GameCanvas extends GameObject {
  constructor(container) {
    super(new Point(0, 0));
    this.canvas = this.createCanvas(container);
    if (!this.canvas.getContext) {
      throw new Error('Canvas is unsupported');
    }

    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = '14px "Martian Mono"';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';

    this.gameObjects = [new Grid(new Point(0, config.headerHeight)), new Timer(new Point(0, 0))];
    this.time = 0;

    this.canvas.addEventListener('mousedown', this.handleCanvasMouseDown);
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    this.gameLoop();
  }

  handleCanvasMouseDown = (e) => {
    const { offsetX: mouseX, offsetY: mouseY } = e;
    const { cellKeys } = gameState;
    cellKeys.forEach((key) => {
      const cell = gameState.getCell(key);
      const {
        offset: { x, y },
        right,
        bottom,
      } = cell;
      if (mouseX >= x && mouseX <= right && mouseY >= y && mouseY <= bottom) {
        if (e.button === MOUSE.LEFT) {
          gameState.revealCell(cell.key);
        } else if (e.button === MOUSE.RIGHT) {
          gameState.flagCell(cell.key);
        }
      }
    });
  };

  createCanvas = (container) => {
    const {
      difficulty: { width, height },
      headerHeight,
      borderWidth,
      cellSize,
    } = config;

    const canvas = document.createElement('canvas');
    canvas.width = cellSize * width + (width + 1) * borderWidth;
    canvas.height = cellSize * height + (height + 1) * borderWidth + headerHeight;
    canvas.id = 'game-canvas';
    container.append(canvas);

    return canvas;
  };

  gameLoop = () => {
    this.update();
    this.draw();
    requestAnimationFrame(this.gameLoop);
  };

  update() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.time;
    this.time = currentTime;

    this.gameObjects.forEach((obj) => {
      obj.update(deltaTime);
    });
  }

  draw() {
    const { ctx } = this;
    const { clientWidth, clientHeight } = ctx.canvas;
    const { cellKeys } = gameState;

    ctx.clearRect(0, 0, clientWidth, clientHeight);

    this.gameObjects.forEach((obj) => {
      obj.draw(ctx);
    });

    ctx.save();
    cellKeys.forEach((key) => {
      const cell = gameState.getCell(key);
      cell.draw(ctx);
    });
    ctx.restore();
  }
}

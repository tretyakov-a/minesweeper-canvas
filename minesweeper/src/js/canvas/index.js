import config from '../config';
import gameState from '../game-state';
import GameObject from './game-object';
import Point from './point';
import FlagsCounter from './ui/flags-counter';
import Grid from './ui/grid';
import ResetBtn from './ui/reset-btn';
import Timer from './ui/timer';
import { options } from './utils';
import { STATUS } from '../constants';

export default class GameCanvas extends GameObject {
  constructor(container) {
    super({ offset: new Point(0, 0) });
    this.canvas = this.createCanvas(container);
    if (!this.canvas.getContext) {
      throw new Error('Canvas is unsupported');
    }

    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = '14px "Martian Mono"';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';

    const { width, height } = this.canvas;
    this.width = width;
    this.height = height;

    const { headerHeight, counterWidth, resetBtnSize } = config;
    this.add('grid', Grid, options(0, headerHeight, width, height - headerHeight));
    this.add('timer', Timer, options(width - counterWidth, 0));
    this.add('flagsCounter', FlagsCounter, options(0, 0));
    this.add(
      'resetBtn',
      ResetBtn,
      options(width / 2 - resetBtnSize / 2, (headerHeight - resetBtnSize) / 2)
    );

    this.time = 0;

    this.canvas.addEventListener('mousedown', this.handleCanvasMouseDown);
    this.canvas.addEventListener('mouseup', this.handleCanvasMouseUp);
    this.canvas.addEventListener('mousemove', this.handleCanvasMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleCanvasMouseLeave);
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    gameState.addEventListener('statusChanged', this.handleGameStatusChange);
    this.gameLoop();
  }

  handleCanvasMouseDown = (e) => {
    super.onMouseDown(e);
  };

  handleCanvasMouseUp = (e) => {
    super.onMouseUp(e);
  };

  handleCanvasMouseMove = (e) => {
    super.onMouseMove(e);
  };

  handleCanvasMouseLeave = (e) => {
    super.onMouseLeave(e);
  };

  reset = () => {
    super.reset();
  };

  handleGameStatusChange = (e) => {
    const { status } = e.detail;
    if (status === STATUS.IDLE) this.reset();
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
    super.update(deltaTime);
  }

  draw() {
    const { ctx } = this;
    const { clientWidth, clientHeight } = ctx.canvas;

    ctx.clearRect(0, 0, clientWidth, clientHeight);
    super.draw(ctx);
  }
}

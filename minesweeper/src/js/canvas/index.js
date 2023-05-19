import config from '../config';
import gameState from '../game-state';
import Point from './core/point';
import Grid from './objects/grid';
import Header from './objects/header';
import {
  gameObjectOptions,
  customMouseEventFromReal,
  ctxApplyStyles,
  createCanvas,
} from './core/utils';
import { STATUS } from '../constants';
import CachedGameObject from './core/cached-game-object';

export default class GameCanvas extends CachedGameObject {
  constructor(container) {
    const canvas = createCanvas(container);
    const { width, height } = canvas;
    super({ offset: new Point(0, 0), width, height });

    this.ctx = canvas.getContext('2d');
    ctxApplyStyles(this.ctx);

    const { headerHeight } = config;
    this.add('grid', Grid, gameObjectOptions(0, headerHeight, width, height - headerHeight));
    this.add('header', Header, gameObjectOptions(0, 0, width, headerHeight));

    this.time = 0;

    canvas.addEventListener('mousedown', this.handleCanvasMouseDown);
    canvas.addEventListener('mouseup', this.handleCanvasMouseUp);
    canvas.addEventListener('mousemove', this.handleCanvasMouseMove);
    canvas.addEventListener('mouseleave', this.handleCanvasMouseLeave);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    gameState.addEventListener('statusChange', this.handleGameStatusChange);
    this.gameLoop();
  }

  handleCanvasMouseDown = (e) => {
    e.preventDefault();
    super.onMouseDown(customMouseEventFromReal('mousedown', e));
  };

  handleCanvasMouseUp = (e) => {
    super.onMouseUp(customMouseEventFromReal('mouseup', e));
  };

  handleCanvasMouseMove = (e) => {
    super.onMouseMove(customMouseEventFromReal('mousemove', e));
  };

  handleCanvasMouseLeave = (e) => {
    super.onMouseLeave(customMouseEventFromReal('mouseleave', e));
  };

  destroy() {
    gameState.removeEventListener('statusChange', this.handleGameStatusChange);
    super.destroy();
  }

  reset() {
    super.reset();
  }

  handleGameStatusChange = (e) => {
    const { status } = e.detail;
    if (status === STATUS.IDLE) this.reset();
  };

  gameLoop = () => {
    this.update();
    if (this.isChanged) {
      this.draw();
    }
    requestAnimationFrame(this.gameLoop);
  };

  update() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.time;
    this.time = currentTime;
    super.update(deltaTime);
  }

  draw() {
    this.drawCached(this.ctx);
  }
}

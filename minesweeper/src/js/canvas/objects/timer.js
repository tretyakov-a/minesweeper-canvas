import config from '@src/js/config';
import { STATUS } from '@src/js/constants';
import gameState from '@src/js/game-state';
import { renderNumber } from '@src/js/helpers';
import theme from '../../theme';
import CachedGameObject from '../core/cached-game-object';

export default class Timer extends CachedGameObject {
  constructor(options) {
    const { counterWidth, headerHeight } = config;
    super({ ...options, width: counterWidth, height: headerHeight });
    this.applyStyles({
      font: '18px "Martian Mono"',
    });
    this.reset();
    gameState.addEventListener('statusChange', this.handleGameStatusChange);
  }

  destroy() {
    gameState.removeEventListener('statusChange', this.handleGameStatusChange);
    super.destroy();
  }

  handleGameStatusChange = (e) => {
    const { status } = e.detail;
    if (status === STATUS.STOPPED) {
      gameState.time = Math.trunc(this.time);
    }
  };

  set time(value) {
    this._time = value;
  }

  get time() {
    return this._time;
  }

  get seconds() {
    return this._seconds;
  }

  set seconds(value) {
    this._seconds = value;
    this.isChanged = true;
  }

  reset() {
    this.time = 0;
    this.seconds = 0;
  }

  update(deltaTime) {
    if (gameState.status !== STATUS.RUNNING) return;
    this.time += deltaTime;
    const timeInSeconds = Math.trunc(this.time / 1000);
    if (timeInSeconds !== this.seconds) {
      this.seconds = timeInSeconds;
    }
  }

  draw(ctx) {
    this.drawCached(ctx, (cacheCtx) => {
      cacheCtx.save();
      cacheCtx.fillStyle = theme.bgColor;
      cacheCtx.fillRect(0, 0, this.width, this.height);
      cacheCtx.restore();
      cacheCtx.fillText(renderNumber(this.seconds), this.width / 2, this.height / 2);
    });
  }
}

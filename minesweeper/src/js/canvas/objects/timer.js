import config from '@src/js/config';
import { STATUS } from '@src/js/constants';
import gameState from '@src/js/game-state';
import { renderNumber } from '@src/js/helpers';
import GameObject from '../game-object';
import theme from '../theme';

export default class Timer extends GameObject {
  constructor(options) {
    const { counterWidth, headerHeight } = config;
    super({ ...options, width: counterWidth, height: headerHeight });

    this.reset();
  }

  set time(value) {
    this._time = value;
  }

  get time() {
    return this._time;
  }

  reset = () => {
    this.time = 0;
  };

  update(deltaTime) {
    if (gameState.status !== STATUS.RUNNING) return;
    this.time += deltaTime;
  }

  draw(ctx) {
    const timeInSeconds = Math.trunc(this.time / 1000);
    super.drawWithOffset(ctx, () => {
      ctx.font = '18px "Martian Mono"';
      ctx.fillStyle = theme.textColor;
      ctx.fillText(renderNumber(timeInSeconds), this.width / 2, this.height / 2);
    });
  }
}

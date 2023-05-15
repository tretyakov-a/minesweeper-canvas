import config from '@src/js/config';
import { STATUS } from '@src/js/constants';
import gameState from '@src/js/game-state';
import { renderNumber } from '@src/js/helpers';
import GameObject from '../game-object';

export default class Timer extends GameObject {
  constructor(offset) {
    super(offset);

    this.width = config.counterWidth;
    this.height = config.headerHeight;

    gameState.addEventListener('statusChanged', this.handleGameStatusChange);
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
    super.draw(ctx, () => {
      ctx.rect(0, 0, this.width, this.height);
      ctx.stroke();
      ctx.fillText(renderNumber(timeInSeconds), this.width / 2, this.height / 2);
    });
  }

  handleGameStatusChange = (e) => {
    const { status } = e.detail;
    switch (status) {
      case STATUS.IDLE:
        return this.reset();
    }
  };
}

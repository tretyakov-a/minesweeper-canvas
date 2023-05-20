import { STATUS } from '@src/js/constants';
import { RESOURCES } from '@src/js/resources';
import gameState from '@src/js/game-state';
import { renderNumber } from '@src/js/helpers';
import Counter from './counter';
import ImageObject from './image-object';

export default class Timer extends Counter {
  constructor(options) {
    super(options);

    this.add('clock', ImageObject, {}, RESOURCES.CLOCK, this.iconHeight, 'left');
    this.textOffsetX = this.get('clock').width + 5;

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
    this._seconds = value > 999 ? 999 : value;
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
    super.draw(ctx, renderNumber(this.seconds));
  }
}

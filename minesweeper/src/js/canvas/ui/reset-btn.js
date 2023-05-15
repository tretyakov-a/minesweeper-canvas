import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { STATUS } from '@src/js/constants';
import { resources } from '@src/js/resources';
import GameObject from '../game-object';

export default class ResetBtn extends GameObject {
  constructor(offset) {
    const { resetBtnSize } = config;
    super(offset, resetBtnSize, resetBtnSize);

    this.iconSize = this.width * 0.6;
    this.iconDrawProps = [
      (this.width - this.iconSize) / 2,
      (this.height - this.iconSize) / 2,
      this.iconSize,
      this.iconSize,
    ];

    this.reset();

    gameState.addEventListener('statusChanged', this.handleGameStatusChange);
    gameState.addEventListener('win', this.handleWin);
    gameState.addEventListener('lose', this.handleLose);
  }

  reset = () => {
    this.icon = resources.playing;
  };

  handleGameStatusChange = (e) => {
    const { status } = e.detail;
    if (status === STATUS.IDLE) this.reset();
  };

  handleWin = () => {
    this.icon = resources.win;
  };

  handleLose = () => {
    this.icon = resources.lose;
  };

  draw(ctx) {
    super.drawWithOffset(ctx, () => {
      ctx.drawImage(resources.closed, 0, 0, this.width, this.height);
      ctx.drawImage(this.icon, ...this.iconDrawProps);
    });
  }
}

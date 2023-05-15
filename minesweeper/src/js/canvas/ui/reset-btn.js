import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { resources } from '@src/js/resources';
import GameObject from '../game-object';

export default class ResetBtn extends GameObject {
  constructor(options) {
    const { resetBtnSize } = config;
    super({ ...options, width: resetBtnSize, height: resetBtnSize });

    this.iconSize = this.width * 0.6;
    this.iconDrawProps = [
      (this.width - this.iconSize) / 2,
      (this.height - this.iconSize) / 2,
      this.iconSize,
      this.iconSize,
    ];

    this.reset();

    gameState.addEventListener('win', this.handleWin);
    gameState.addEventListener('lose', this.handleLose);
    this.addEventListener('mousedown', this.handleMouseDown);
  }

  reset = () => {
    this.icon = resources.playing;
    this.bgImage = resources.closed;
  };

  handleMouseDown = () => {
    this.bgImage = resources.opened;
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseUp = () => {
    gameState.reset();
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  handleWin = () => {
    this.icon = resources.win;
  };

  handleLose = () => {
    this.icon = resources.lose;
  };

  draw(ctx) {
    super.drawWithOffset(ctx, () => {
      ctx.drawImage(this.bgImage, 0, 0, this.width, this.height);
      ctx.drawImage(this.icon, ...this.iconDrawProps);
    });
  }
}

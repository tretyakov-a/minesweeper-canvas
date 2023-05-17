import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { RESOURCES } from '@src/js/resources';
import GameObject from '../game-object';
import ImageObject from './image-object';
import theme from '../theme';

export default class ResetBtn extends GameObject {
  constructor(options) {
    const { resetBtnSize } = config;
    super({ ...options, width: resetBtnSize, height: resetBtnSize });

    this.add('icon', ImageObject, {}, RESOURCES.PLAYING, resetBtnSize * 0.8);

    gameState.addEventListener('win', this.handleWin);
    gameState.addEventListener('lose', this.handleLose);
    this.addEventListener('mousedown', this.handleMouseDown);
  }

  reset = () => {
    this.get('icon').resourceKey = RESOURCES.PLAYING;
  };

  handleMouseDown = () => {
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseUp = () => {
    gameState.reset();
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  handleWin = () => {
    this.get('icon').resourceKey = RESOURCES.WIN;
  };

  handleLose = () => {
    this.get('icon').resourceKey = RESOURCES.LOSE;
  };

  draw(ctx) {
    super.drawWithOffset(ctx, () => {
      if (this.isHovered) {
        ctx.fillStyle = theme.cellBg.hightlight;
        ctx.fillRect(0, 0, this.width, this.height);
      }
    });
  }
}

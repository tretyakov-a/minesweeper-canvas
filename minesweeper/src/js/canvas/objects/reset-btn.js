import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { RESOURCES } from '@src/js/resources';
import ImageObject from './image-object';
import theme from '../../theme';
import CachedGameObject from '../core/cached-game-object';

export default class ResetBtn extends CachedGameObject {
  constructor(options) {
    const { resetBtnSize } = config;
    super({ ...options, width: resetBtnSize, height: resetBtnSize });

    this.add('icon', ImageObject, {}, RESOURCES.PLAYING, resetBtnSize * 0.8);

    gameState.addEventListener('win', this.handleWin);
    gameState.addEventListener('lose', this.handleLose);
    this.addEventListener('mousedown', this.handleMouseDown);
    this.setCursor('pointer');
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
    this.drawCached(ctx, (cacheCtx) => {
      cacheCtx.fillStyle = theme.bgColor;
      cacheCtx.fillRect(0, 0, this.width, this.height);
      if (!this.isHovered) return;
      cacheCtx.fillStyle = theme.cellBg.hightlight;
      cacheCtx.fillRect(0, 0, this.width, this.height);
    });
  }
}

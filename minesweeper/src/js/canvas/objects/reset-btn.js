import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { RESOURCES } from '@src/js/resources';
import ImageObject from './image-object';
import theme from '../../theme';
import CachedGameObject from '../core/cached-game-object';
import { RESULT } from '@src/js/constants';
import { applyBg } from '../core/utils';

export default class ResetBtn extends CachedGameObject {
  constructor(options) {
    const { resetBtnSize } = config;
    super({ ...options, width: resetBtnSize, height: resetBtnSize });

    this.add('icon', ImageObject, {}, RESOURCES.PLAYING, resetBtnSize * 0.8);

    gameState.addEventListener('gameOver', this.handleGameOver);
    this.addEventListener('mousedown', this.handleMouseDown);
    this.setCursor('pointer');
  }

  destroy() {
    gameState.removeEventListener('gameOver', this.handleGameOver);
    super.destroy();
  }

  reset() {
    this.get('icon').resourceKey = RESOURCES.PLAYING;
  }

  handleMouseDown = () => {
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseUp = () => {
    gameState.reset();
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  handleGameOver = (e) => {
    const { result } = e.detail;
    this.get('icon').resourceKey = result === RESULT.LOSS ? RESOURCES.LOSS : RESOURCES.WIN;
  };

  draw(ctx) {
    this.drawCached(ctx, (cacheCtx) => {
      applyBg.call(this, cacheCtx);
      if (!this.isHovered) return;
      cacheCtx.fillStyle = theme[gameState.theme].highlightMediumColor;
      cacheCtx.fillRect(0, 0, this.width, this.height);
    });
  }
}

import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { RESOURCES, RESULT } from '@src/js/constants';
import { settings } from '@src/js/game-env/settings';
import ImageObject from './image-object';
import theme from '@src/js/theme';
import CachedGameObject from '../core/cached-game-object';
import { applyBg } from '../core/utils';

export default class ResetBtn extends CachedGameObject {
  constructor(options) {
    const { resetBtnSize } = config;
    super({ ...options, width: resetBtnSize, height: resetBtnSize });

    this.add('icon', ImageObject, {}, RESOURCES.PLAYING_ICON, resetBtnSize * 0.8);

    this.isBlocked = false;

    gameState.addEventListener('gameOver', this.handleGameOver);
    this.addEventListener('mousedown', this.handleMouseDown);
    this.setCursor('pointer');
  }

  destroy() {
    gameState.removeEventListener('gameOver', this.handleGameOver);
    super.destroy();
  }

  reset() {
    this.get('icon').resourceKey = RESOURCES.PLAYING_ICON;
  }

  handleMouseDown = () => {
    if (this.isBlocked) return;
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseUp = () => {
    gameState.reset();
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  handleGameOver = (e) => {
    const { result } = e.detail;
    this.get('icon').resourceKey =
      result === RESULT.LOSS ? RESOURCES.LOSS_ICON : RESOURCES.WIN_ICON;

    this.isBlocked = true;
    setTimeout(() => {
      this.isBlocked = false;
    }, config.gameOverModalDelay);
  };

  draw(ctx) {
    this.drawCached(ctx, (cacheCtx) => {
      applyBg.call(this, cacheCtx);
      if (!this.isHovered) return;
      cacheCtx.fillStyle = theme[settings.theme].highlightMediumColor;
      cacheCtx.fillRect(0, 0, this.width, this.height);
    });
  }
}

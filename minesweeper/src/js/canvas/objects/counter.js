import config from '@src/js/config';
import CachedGameObject from '../core/cached-game-object';
import { applyBg } from '../core/utils';
import theme from '@src/js/theme';
import gameState from '@src/js/game-state';

export default class Counter extends CachedGameObject {
  constructor(options) {
    const { counterWidth, headerHeight } = config;
    const width = options.width !== 0 ? options.width : counterWidth;
    super({ ...options, width, height: headerHeight });

    this.iconHeight = 18;

    this.applyStyles({
      font: 'normal 300 18px "Martian Mono"',
      textAlign: 'left',
    });
  }

  draw(ctx, text) {
    this.drawCached(ctx, (cacheCtx) => {
      applyBg.call(this, cacheCtx);
      cacheCtx.fillStyle = theme[gameState.theme].textColor;
      cacheCtx.fillText(text, this.textOffsetX, this.height / 2);
    });
  }
}

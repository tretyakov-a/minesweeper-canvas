import config from '@src/js/config';
import CachedGameObject from '../core/cached-game-object';
import theme from '@src/js/theme';

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
      cacheCtx.save();
      cacheCtx.fillStyle = theme.bgColor;
      cacheCtx.fillRect(0, 0, this.width, this.height);
      cacheCtx.restore();
      cacheCtx.fillText(text, this.textOffsetX, this.height / 2);
    });
  }
}

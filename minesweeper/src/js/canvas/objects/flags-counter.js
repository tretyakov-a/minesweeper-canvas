import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { renderNumber } from '@src/js/helpers';
import { RESOURCES } from '@src/js/resources';
import ImageObject from './image-object';
import theme from '../../theme';
import CachedGameObject from '../core/cached-game-object';

const FLAG_SIZE = 18;

export default class FlagsCounter extends CachedGameObject {
  constructor(options) {
    const { counterWidth, headerHeight } = config;
    super({ ...options, width: counterWidth, height: headerHeight });

    this.add('flag', ImageObject, {}, RESOURCES.FLAG, FLAG_SIZE, 'right');
    this.applyStyles({
      font: '18px "Martian Mono"',
    });
    gameState.addEventListener('flagsCounterChanged', this.handleFlagCounterChange);
  }

  handleFlagCounterChange = () => {
    this.isChanged = true;
  };

  draw(ctx) {
    this.drawCached(ctx, (cacheCtx) => {
      cacheCtx.save();
      cacheCtx.fillStyle = theme.bgColor;
      cacheCtx.fillRect(0, 0, this.width, this.height);
      cacheCtx.restore();
      cacheCtx.fillText(
        renderNumber(gameState.flagsCounter, 2),
        this.width / 2 - 5,
        this.height / 2
      );
    });
  }
}

import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { renderNumber } from '@src/js/helpers';
import GameObject from '../game-object';
import theme from '../theme';
import ImageObject from './image-object';
import { RESOURCES } from '@src/js/resources';

export default class FlagsCounter extends GameObject {
  constructor(flagsCounterOptions) {
    const { counterWidth, headerHeight } = config;
    super({ ...flagsCounterOptions, width: counterWidth, height: headerHeight });

    this.add('flag', ImageObject, {}, RESOURCES.FLAG, 18, 'right');
  }

  draw(ctx) {
    super.drawWithOffset(ctx, () => {
      ctx.font = '18px "Martian Mono"';
      ctx.fillStyle = theme.textColor;
      ctx.fillText(renderNumber(gameState.flagsCounter, 2), this.width / 2 - 5, this.height / 2);
    });
  }
}

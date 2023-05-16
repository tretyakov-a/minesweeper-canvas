import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { resources } from '@src/js/resources';
import { renderNumber } from '@src/js/helpers';
import GameObject from '../game-object';
import { options } from '../utils';
import theme from '../theme';

class Flag extends GameObject {
  draw(ctx) {
    super.drawWithOffset(ctx, () => {
      ctx.drawImage(resources.flag, 0, 0, this.width, this.height);
    });
  }
}

export default class FlagsCounter extends GameObject {
  constructor(flagsCounterOptions) {
    const { counterWidth, headerHeight } = config;
    super({ ...flagsCounterOptions, width: counterWidth, height: headerHeight });

    const flagWidth = 15;
    const { width, height } = resources.flag;
    const flagSizeRatio = width / height;
    const flagHeight = flagWidth / flagSizeRatio;

    this.add(
      'flag',
      Flag,
      options(config.counterWidth - flagWidth - 5, flagHeight / 2, flagWidth, flagHeight)
    );
  }

  draw(ctx) {
    super.drawWithOffset(ctx, () => {
      ctx.fillStyle = theme.textColor;
      ctx.fillText(renderNumber(gameState.flagsCounter, 2), this.width / 2 - 5, this.height / 2);
    });
    super.draw(ctx);
  }
}

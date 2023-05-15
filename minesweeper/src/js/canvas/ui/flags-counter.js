import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { resources } from '@src/js/resources';
import { renderNumber } from '@src/js/helpers';
import GameObject from '../game-object';
import Point from '../point';

class Flag extends GameObject {
  constructor(offset) {
    super(offset);

    const { width, height } = resources.flag;
    const flagSizeRatio = width / height;
    this.width = 15;
    this.height = this.width / flagSizeRatio;
  }

  draw(ctx) {
    ctx.drawImage(
      resources.flag,
      config.counterWidth - this.width - 5,
      this.height / 2,
      this.width,
      this.height
    );
  }
}

export default class FlagsCounter extends GameObject {
  constructor(offset) {
    super(offset);

    this.width = config.counterWidth;
    this.height = config.headerHeight;

    this.flag = new Flag(new Point(offset.x, offset.y));
  }

  draw(ctx) {
    super.draw(ctx, () => {
      ctx.rect(0, 0, this.width - 1, this.height);
      ctx.stroke();
      ctx.fillText(renderNumber(gameState.flagsCounter, 2), this.width / 2 - 5, this.height / 2);
      this.flag.draw(ctx);
    });
  }
}

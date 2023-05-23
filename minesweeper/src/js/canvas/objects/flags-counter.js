import gameState from '@src/js/game-state';
import { renderNumber } from '@src/js/helpers';
import { RESOURCES } from '@src/js/constants';
import ImageObject from './image-object';
import Counter from './counter';

export default class FlagsCounter extends Counter {
  constructor(options) {
    super(options);

    this.add('flag', ImageObject, {}, RESOURCES.FLAG, this.iconHeight, 'right');
    this.textOffsetX = 5;

    gameState.addEventListener('flagsCounterChange', this.handleFlagCounterChange);
  }

  destroy() {
    gameState.removeEventListener('flagsCounterChange', this.handleFlagCounterChange);
    super.destroy();
  }

  handleFlagCounterChange = () => {
    this.isChanged = true;
  };

  draw(ctx) {
    super.draw(ctx, renderNumber(gameState.flagsCounter, 2));
  }
}

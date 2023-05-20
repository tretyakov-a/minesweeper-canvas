import gameState from '@src/js/game-state';
import { renderNumber } from '@src/js/helpers';
import { RESOURCES } from '@src/js/resources';
import ImageObject from './image-object';
import Counter from './counter';

export default class FlagsCounter extends Counter {
  constructor(options) {
    super(options);

    this.add('flag', ImageObject, {}, RESOURCES.FLAG, this.iconHeight, 'right');
    this.textOffsetX = 5;

    gameState.addEventListener('flagsCounterChanged', this.handleFlagCounterChange);
  }

  destroy() {
    gameState.removeEventListener('flagsCounterChanged', this.handleFlagCounterChange);
    super.destroy();
  }

  handleFlagCounterChange = () => {
    this.isChanged = true;
  };

  draw(ctx) {
    super.draw(ctx, renderNumber(gameState.flagsCounter, 2));
  }
}

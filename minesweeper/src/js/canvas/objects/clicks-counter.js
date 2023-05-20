import gameState from '@src/js/game-state';
import { renderNumber } from '@src/js/helpers';
import { RESOURCES } from '@src/js/resources';
import ImageObject from './image-object';
import Counter from './counter';

export default class ClicksCounter extends Counter {
  constructor(options) {
    super(options);

    this.add('mouse', ImageObject, {}, RESOURCES.MOUSE, this.iconHeight, 'left');
    this.textOffsetX = this.get('mouse').width + 5;

    gameState.addEventListener('clicksCounterChange', this.handleClicksCounterChange);
  }

  destroy() {
    gameState.removeEventListener('clicksCounterChange', this.handleClicksCounterChange);
    super.destroy();
  }

  handleClicksCounterChange = () => {
    this.isChanged = true;
  };

  draw(ctx) {
    super.draw(ctx, renderNumber(gameState.clicksCounter, 1));
  }
}

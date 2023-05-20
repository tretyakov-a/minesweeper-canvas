import config from '@src/js/config';
import Timer from './timer';
import FlagsCounter from './flags-counter';
import ResetBtn from './reset-btn';
import { gameObjectOptions } from '../core/utils';
import CachedGameObject from '../core/cached-game-object';
import ClicksCounter from './clicks-counter';

class HeaderCenter extends CachedGameObject {
  constructor(options, timerWidth) {
    super(options);

    const { headerHeight, resetBtnSize } = config;
    this.add('timer', Timer, gameObjectOptions(0, 0, timerWidth));
    this.add(
      'resetBtn',
      ResetBtn,
      gameObjectOptions(timerWidth, (headerHeight - resetBtnSize) / 2)
    );
  }

  draw(ctx) {
    this.drawCached(ctx);
  }
}

export default class Header extends CachedGameObject {
  constructor(options) {
    super(options);

    const { counterWidth, resetBtnSize } = config;

    const clockIconWidth = 18;
    const timerWidth = counterWidth + clockIconWidth;
    const headerCenterWidth = timerWidth + resetBtnSize;
    this.add(
      'headerCenter',
      HeaderCenter,
      gameObjectOptions(
        Math.floor((this.width - headerCenterWidth) / 2),
        0,
        headerCenterWidth,
        this.height
      ),
      timerWidth
    );
    this.add('clicksCounter', ClicksCounter, gameObjectOptions(5, 0));
    this.add('flagsCounter', FlagsCounter, gameObjectOptions(this.width - counterWidth - 5, 0));
  }

  draw(ctx) {
    this.drawCached(ctx);
  }
}

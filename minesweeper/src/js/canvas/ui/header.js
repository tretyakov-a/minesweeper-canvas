import config from '@src/js/config';
import GameObject from '../game-object';
import Timer from './timer';
import FlagsCounter from './flags-counter';
import ResetBtn from './reset-btn';
import { gameObjectOptions } from '../utils';

export default class Header extends GameObject {
  constructor(options) {
    super(options);

    const { headerHeight, counterWidth, resetBtnSize } = config;
    this.add('timer', Timer, gameObjectOptions(this.width - counterWidth, 0));
    this.add('flagsCounter', FlagsCounter, {});
    this.add(
      'resetBtn',
      ResetBtn,
      gameObjectOptions(this.width / 2 - resetBtnSize / 2, (headerHeight - resetBtnSize) / 2)
    );
  }
}

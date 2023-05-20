import { resources } from '@src/js/resources';
import GameObject from '../core/game-object';
import Point from '../core/point';
import gameState from '@src/js/game-state';

export default class ImageObject extends GameObject {
  constructor(options, resourceKey, imgHeight, position = 'center') {
    const { width, height } = resources[gameState.theme][resourceKey];
    const flagSizeRatio = width / height;
    const imgWidth = Math.floor(imgHeight * flagSizeRatio);
    const { parent } = options;

    let offsetX = Math.floor((parent.width - imgWidth) / 2);
    let offsetY = Math.floor((parent.height - imgHeight) / 2);
    if (position === 'right') offsetX = parent.width - imgWidth;
    if (position === 'left') offsetX = 0;

    super({
      ...options,
      offset: new Point(offsetX, offsetY),
      width: imgWidth,
      height: imgHeight,
    });

    this.resourceKey = resourceKey;
    this.position = position;
  }

  get resourceKey() {
    return this._resourceKey;
  }

  set resourceKey(value) {
    this._resourceKey = value;
    this.isChanged = true;
  }

  draw(ctx) {
    super.drawWithOffset(
      ctx,
      () => {
        ctx.drawImage(resources[gameState.theme][this.resourceKey], 0, 0, this.width, this.height);
      },
      0
    );
  }
}

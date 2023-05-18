import { resources } from '@src/js/resources';
import GameObject from '../game-object';
import Point from '../point';

export default class ImageObject extends GameObject {
  constructor(options, resourceKey, imgHeight, position = 'center') {
    const { width, height } = resources[resourceKey];
    const flagSizeRatio = width / height;
    const imgWidth = imgHeight * flagSizeRatio;
    const { parent } = options;

    let offsetX = (parent.width - imgWidth) / 2;
    let offsetY = (parent.height - imgHeight) / 2;
    if (position === 'right') offsetX = parent.width - imgWidth - 5;

    super({
      ...options,
      offset: new Point(offsetX, offsetY),
      width: imgWidth,
      height: imgHeight,
    });

    this.resourceKey = resourceKey;
    this.position = position;
  }

  draw(ctx) {
    super.drawWithOffset(
      ctx,
      () => {
        ctx.drawImage(resources[this.resourceKey], 0, 0, this.width, this.height);
      },
      0
    );
  }
}

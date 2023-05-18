import GameObject from './game-object';
import { ctxApplyStyles } from './utils';

export default class CachedGameObject extends GameObject {
  constructor(options) {
    super(options);

    this.cacheCanvas = document.createElement('canvas');
    this.cacheCanvas.width = options.width;
    this.cacheCanvas.height = options.height;

    this.cacheCtx = this.cacheCanvas.getContext('2d');
    ctxApplyStyles(this.cacheCtx);

    this.isCached = true;
  }

  applyStyles(styles) {
    Object.keys(styles).forEach((key) => {
      this.cacheCtx[key] = styles[key];
    });
  }

  drawDescendants(ctx) {
    for (const obj of this.objects.values()) {
      if (obj.isChanged) {
        obj.draw(ctx);
      }
    }
  }

  drawCached(ctx, draw) {
    if (this.isChanged) {
      if (draw) draw(this.cacheCtx);
      this.drawDescendants(this.cacheCtx);
      this.isChanged = false;
    }

    if (this.parent && this.parent.isCached) {
      const { offset } = this.parent;
      ctx.drawImage(this.cacheCanvas, this.offset.x - offset.x, this.offset.y - offset.y);
    } else {
      this.drawWithOffset(
        ctx,
        () => {
          ctx.drawImage(this.cacheCanvas, 0, 0);
        },
        0
      );
    }
  }
}

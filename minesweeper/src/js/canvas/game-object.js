export default class GameObject extends EventTarget {
  constructor(offset) {
    super();
    this.offset = offset;
  }

  // update() {}

  draw(ctx, cb) {
    const { x, y } = this.offset;
    ctx.save();
    ctx.translate(x + 0.5, y + 0.5);
    if (cb) cb();
    ctx.restore();
  }
}

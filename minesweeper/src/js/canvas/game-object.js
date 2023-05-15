import Point from './point';

export default class GameObject extends EventTarget {
  constructor(options) {
    super();
    const { offset, width = 0, height = 0 } = options;
    this.offset = offset;
    this.width = width;
    this.height = height;
    this.right = offset.x + width;
    this.bottom = offset.y + height;
    this.objects = new Map();

    this.hovered = new Map();
    this.isHovered = false;
  }

  reset() {
    for (const obj of this.objects.values()) {
      obj.reset();
    }
  }

  add(key, ObjectConstructor, options, ...rest) {
    const { offsetX, offsetY, width = 0, height = 0 } = options;
    const { x, y } = this.offset;
    this.objects.set(
      key,
      new ObjectConstructor({ offset: new Point(x + offsetX, y + offsetY), width, height }, ...rest)
    );
  }

  remove(key) {
    this.objects.delete(key);
  }

  get(key) {
    return this.objects.get(key);
  }

  update(deltaTime) {
    for (const obj of this.objects.values()) {
      obj.update(deltaTime);
    }
  }

  contains({ x: mouseX, y: mouseY }) {
    const {
      offset: { x, y },
      right,
      bottom,
    } = this;
    return mouseX >= x && mouseX <= right && mouseY >= y && mouseY <= bottom;
  }

  draw(ctx) {
    for (const obj of this.objects.values()) {
      obj.draw(ctx);
    }
  }

  drawWithOffset(ctx, cb) {
    const { x, y } = this.offset;
    ctx.save();
    ctx.translate(x + 0.5, y + 0.5);
    if (cb) cb();
    ctx.restore();
  }

  checkMousePosition(e, onContains) {
    const mousePos = new Point(e.offsetX, e.offsetY);
    for (const entrie of this.objects.entries()) {
      if (entrie[1].contains(mousePos)) {
        onContains(entrie);
      }
    }
  }

  onMouseDown(e) {
    this.checkMousePosition(e, (entrie) => {
      entrie[1].dispatchEvent(new MouseEvent('mousedown', e));
      return entrie[1].onMouseDown(e);
    });
  }

  onMouseUp(e) {
    this.checkMousePosition(e, (entrie) => {
      entrie[1].dispatchEvent(new MouseEvent('mouseup', e));
      return entrie[1].onMouseUp(e);
    });
  }

  onMouseEnter(e) {
    this.isHovered = true;
    this.dispatchEvent(new MouseEvent('mouseenter', e));
  }

  onMouseLeave(e) {
    this.isHovered = false;
    this.dispatchEvent(new MouseEvent('mouseleave', e));
    for (const v of this.hovered.values()) {
      v.onMouseLeave(e);
    }
    this.hovered.clear();
  }

  onMouseMove(e) {
    this.checkMousePosition(e, ([key, obj]) => {
      obj.dispatchEvent(new MouseEvent('mousemove', e));
      if (!this.hovered.has(key)) {
        for (const v of this.hovered.values()) {
          v.onMouseLeave(e);
        }
        this.hovered.clear();
        this.hovered.set(key, obj);
        obj.onMouseEnter(e);
      }
      return obj.onMouseMove(e);
    });
  }
}

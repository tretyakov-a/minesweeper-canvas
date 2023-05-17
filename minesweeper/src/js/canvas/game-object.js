import Point from './point';
import { customMouseEvent } from './utils';

export default class GameObject extends EventTarget {
  constructor(options) {
    super();
    const { offset, width = 0, height = 0, parent } = options;
    this.parent = parent;
    this.offset = offset;
    this.width = width;
    this.height = height;
    this.right = offset.x + width;
    this.bottom = offset.y + height;
    this.objects = new Map();
    this.hovered = new Map();
    this.isHovered = false;

    // console.log(this.offset, this.width, this.height, this.constructor.name);
  }

  reset() {
    for (const obj of this.objects.values()) {
      obj.reset();
    }
  }

  add(key, ObjectConstructor, options, ...rest) {
    const { offsetX = 0, offsetY = 0, width = 0, height = 0 } = options;
    const { x, y } = this.offset;
    this.objects.set(
      key,
      new ObjectConstructor(
        { offset: new Point(x + offsetX, y + offsetY), width, height, parent: this },
        ...rest
      )
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

  contains(mouseX, mouseY) {
    const {
      offset: { x, y },
      right,
      bottom,
    } = this;
    return mouseX >= x && mouseX <= right && mouseY >= y && mouseY <= bottom;
  }

  drawDescendants(ctx) {
    for (const obj of this.objects.values()) {
      obj.draw(ctx);
    }
  }

  draw(ctx) {
    this.drawDescendants(ctx);
  }

  drawWithOffset(ctx, cb, offset = 0.5) {
    const { x, y } = this.offset;
    ctx.save();
    ctx.translate(x + offset, y + offset);
    if (cb) cb();
    this.drawDescendants(ctx);
    ctx.restore();
  }

  checkMousePosition(e, onContains) {
    const { offsetX, offsetY } = e.detail;
    for (const [key, obj] of this.objects.entries()) {
      if (obj.contains(offsetX, offsetY)) {
        onContains(obj, key);
      }
    }
  }

  onMouseDown(e) {
    this.checkMousePosition(e, (obj) => {
      obj.dispatchEvent(customMouseEvent('mousedown', e.detail));
      return obj.onMouseDown(e);
    });
  }

  onMouseUp(e) {
    this.checkMousePosition(e, (obj) => {
      obj.dispatchEvent(customMouseEvent('mouseup', e.detail));
      return obj.onMouseUp(e);
    });
  }

  onMouseEnter(e) {
    this.isHovered = true;
    this.dispatchEvent(customMouseEvent('mouseenter', e.detail));
  }

  onMouseLeave(e) {
    this.isHovered = false;
    this.dispatchEvent(customMouseEvent('mouseleave', e.detail));
    for (const v of this.hovered.values()) {
      v.onMouseLeave(e);
    }
    this.hovered.clear();
  }

  onMouseMove(e) {
    this.checkMousePosition(e, (obj, key) => {
      obj.dispatchEvent(customMouseEvent('mousemove', e.detail));
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

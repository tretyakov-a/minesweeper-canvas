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
    this.isChanged = true;

    // console.log(this.offset, this.width, this.height, this.constructor.name);
  }

  get isChanged() {
    return this._isChanged;
  }

  set isChanged(value) {
    this._isChanged = value;
    if (this.parent) this.parent.isChanged = value;
  }

  get isHovered() {
    return this._isHovered;
  }

  set isHovered(value) {
    this.isChanged = true;
    this._isHovered = value;
  }

  onChange() {
    this.isChanged = true;
    for (const obj of this.objects.values()) {
      obj.onChange();
    }
  }

  destroy() {
    for (const obj of this.objects.values()) {
      obj.destroy();
    }
    this.objects.clear();
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

  drawWithOffset(ctx, cb) {
    const { x, y } = this.offset;
    ctx.save();
    ctx.translate(x, y);
    if (cb) cb();
    ctx.restore();
  }

  checkMousePosition(e, onContains) {
    let isInObject = false;
    const { offsetX, offsetY } = e.detail;
    for (const [key, obj] of this.objects.entries()) {
      if (obj.contains(offsetX, offsetY)) {
        isInObject = true;
        onContains(obj, key);
      }
    }
    return isInObject;
  }

  onMouseDown(e) {
    this.checkMousePosition(e, (obj) => {
      obj.dispatchEvent(e);
      return obj.onMouseDown(e);
    });
  }

  onMouseUp(e) {
    this.checkMousePosition(e, (obj) => {
      obj.dispatchEvent(e);
      return obj.onMouseUp(e);
    });
  }

  onMouseEnter(e) {
    this.isHovered = true;
    this.dispatchEvent(e);
  }

  onMouseLeave(e) {
    this.isHovered = false;
    this.dispatchEvent(e);
    for (const v of this.hovered.values()) {
      v.onMouseLeave(e);
    }
    this.hovered.clear();
  }

  unhover = (e) => {
    for (const v of this.hovered.values()) {
      v.onMouseLeave(customMouseEvent('mouseleave', e.detail));
    }
    this.hovered.clear();
  };

  onMouseMove(e) {
    const isInObject = this.checkMousePosition(e, (obj, key) => {
      obj.dispatchEvent(e);
      if (!this.hovered.has(key)) {
        this.unhover(e);
        this.hovered.set(key, obj);
        obj.onMouseEnter(customMouseEvent('mouseenter', e.detail));
      }
      return obj.onMouseMove(e);
    });
    if (!isInObject) {
      this.unhover(e);
    }
  }

  setCursor(cursor = 'pointer') {
    const handleMouseEnter = () => {
      document.body.style.cursor = cursor;
    };

    const handleMouseLeave = () => {
      document.body.style.cursor = 'default';
    };

    this.addEventListener('mouseenter', handleMouseEnter);
    this.addEventListener('mouseleave', handleMouseLeave);
  }
}

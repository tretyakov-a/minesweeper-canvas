import CachedGameObject from '../core/cached-game-object';
import Point from '../core/point';

export default class Explosion extends CachedGameObject {
  constructor(options, sprite, numberOfFrames = new Point(5, 5)) {
    const { width, height } = sprite;
    const { x, y } = numberOfFrames;
    const frameWidth = Math.floor(width / x);
    const frameHeight = Math.floor(height / y);
    super({ ...options, width: frameWidth, height: frameHeight });

    this.numberOfFrames = numberOfFrames;
    this.sprite = sprite;

    this.frames = [null];
    for (let row = 0; row < y; row += 1) {
      for (let col = 0; col < x; col += 1) {
        this.frames.push(new Point(col * frameWidth, row * frameHeight));
      }
    }
    this.frames.push(null, null);

    this.frameIdx = 0;
    this.time = 0;
    this.msPerFrame = 1000 / 24;

    this.isPlaying = false;
  }

  play(position) {
    this.offset = position;
    this.isPlaying = true;
    this.time = 0;
    this.frameIdx = 0;
  }

  stop() {
    this.isPlaying = false;
    return false;
  }

  update(deltaTime) {
    if (!this.isPlaying) return false;
    this.time += deltaTime;
    if (this.time >= this.msPerFrame) {
      const framesToAdd = Math.trunc(this.time / this.msPerFrame);
      this.frameIdx += framesToAdd;
      if (this.frameIdx >= this.frames.length - 1) return this.stop();

      this.frameIdx = this.frameIdx % (this.frames.length - 1);
      this.time = this.time - this.msPerFrame * framesToAdd;
      this.isChanged = true;
    }
    return this.isChanged;
  }

  draw(ctx) {
    this.drawCached(ctx, (cacheCtx) => {
      cacheCtx.clearRect(0, 0, this.width, this.height);
      const frame = this.frames[this.frameIdx];
      if (frame === null) {
        cacheCtx.clearRect(0, 0, this.width, this.height);
      } else {
        const { x, y } = frame;
        cacheCtx.drawImage(
          this.sprite,
          x,
          y,
          this.width,
          this.height,
          0,
          0,
          this.width,
          this.height
        );
      }
    });
  }
}

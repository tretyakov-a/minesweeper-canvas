import config from './config';

export default class Cell extends EventTarget {
  constructor(x, y) {
    super();
    const { cellSize } = config;
    this.left = x;
    this.top = y;
    this.bottom = y + cellSize;
    this.right = x + cellSize;
    this.bgColor = 'white';
    this.addEventListener('mousedown', this.handleMouseDown);
  }

  draw = (ctx) => {
    const { top, left, bgColor } = this;
    const { cellSize } = config;
    ctx.fillStyle = bgColor;
    ctx.fillRect(left, top, cellSize, cellSize);
  };

  handleMouseDown = () => {
    console.log('Mouse down', this.left, this.top);
    this.bgColor = 'green';
  };
}

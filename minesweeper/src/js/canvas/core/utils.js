import theme from '../../theme';
import config from '../../config';

export const gameObjectOptions = (offsetX, offsetY, width = 0, height = 0) => {
  return {
    offsetX,
    offsetY,
    width,
    height,
  };
};

export const customMouseEvent = (name, detail) => {
  return new CustomEvent(name, { detail });
};

export const customMouseEventFromReal = (name, e) => {
  const { offsetX, offsetY, button } = e;
  return new CustomEvent(name, { detail: { offsetX, offsetY, button } });
};

export const ctxApplyStyles = (ctx) => {
  ctx.fillStyle = theme.textColor;
  ctx.font = '14px "Martian Mono"';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
};

export const createCanvas = (container) => {
  const {
    difficulty: { width, height },
    headerHeight,
    borderWidth,
    cellSize,
  } = config;

  const canvas = document.createElement('canvas');
  if (!canvas.getContext) {
    throw new Error('Canvas is unsupported');
  }
  canvas.width = cellSize * width + (width + 1) * borderWidth;
  canvas.height = cellSize * height + (height + 1) * borderWidth + headerHeight;
  canvas.id = 'game-canvas';
  container.append(canvas);

  return canvas;
};

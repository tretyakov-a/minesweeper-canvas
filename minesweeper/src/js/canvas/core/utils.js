import theme from '@src/js/theme';
import config from '@src/js/config';
import gameState from '@src/js/game-state';
import difficulty from '@src/js/difficulty';

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
  const { headerHeight, getCellSize } = config;
  const cellSize = getCellSize(gameState.difficultyKey);
  const { width, height } = difficulty[gameState.difficultyKey];
  const canvas = document.createElement('canvas');
  if (!canvas.getContext) {
    throw new Error('Canvas is unsupported');
  }
  canvas.width = cellSize * width;
  canvas.height = cellSize * height + headerHeight;
  canvas.id = 'game-canvas';
  container.append(canvas);

  return canvas;
};

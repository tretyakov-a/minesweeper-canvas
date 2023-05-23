import theme from '@src/js/theme';
import config from '@src/js/config';
import { settings } from '@src/js/game-env/settings';
// import gameState from '@src/js/game-state';
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
  ctx.fillStyle = theme[settings.theme].textColor;
  ctx.font = '14px "Martian Mono"';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
};

export const createCanvas = (container) => {
  const { headerHeight, getCellSize } = config;
  const cellSize = getCellSize(settings.difficultyKey);
  const { width, height } = difficulty[settings.difficultyKey];
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

export function applyBg(ctx, bgColor = theme[settings.theme].primaryMediumColor) {
  ctx.save();
  ctx.fillStyle = theme[settings.theme].bgColor;
  ctx.fillRect(0, 0, this.width, this.height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, this.width, this.height);
  ctx.restore();
}

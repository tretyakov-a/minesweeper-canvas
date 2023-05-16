export const options = (offsetX, offsetY, width = 0, height = 0) => {
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

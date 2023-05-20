import gameState from '../game-state';
import difficulty from '../difficulty';
import { THEME } from '../constants';

let form = null;
let minesInput = null;
let difficultySelect = null;
let themeSelect = null;

let currentDifficulty = null;
let numOfMines = null;

//TODO: theme - load from local store
let theme = THEME.LIGHT;

let callbacks = null;

const handleThemeChange = (e) => {
  console.log('handleThemeChange', e.target.value);
  theme = e.target.value;
};

const handleDifficultyChange = (e) => {
  const { value } = e.target;
  if (value !== currentDifficulty) {
    currentDifficulty = value;
    const defaultMines = difficulty[value].mines;
    minesInput.value = defaultMines;
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  numOfMines = formData.get('mines');
  theme = formData.get('theme');

  const defaultMines = difficulty[currentDifficulty].mines;

  const isCustom = numOfMines !== defaultMines;

  if (currentDifficulty !== gameState.difficultyKey || isCustom) {
    gameState.reset(currentDifficulty, isCustom);
    gameState.numOfMines = numOfMines;
    callbacks.onDifficultyChange();
  }

  callbacks.onSubmit();
};

export const initSettings = (args) => {
  callbacks = args;

  difficultySelect = document.querySelector('select[name="difficulty"]');
  difficultySelect.addEventListener('change', handleDifficultyChange);

  themeSelect = document.querySelector('select[name="theme"]');
  themeSelect.addEventListener('change', handleThemeChange);

  minesInput = document.querySelector('.mines-input input[type="number"]');

  form = document.querySelector('.settings__form');
  form.addEventListener('submit', handleFormSubmit);

  applySettings();
};

export const applySettings = () => {
  currentDifficulty = gameState.difficultyKey;
  numOfMines = gameState.numOfMines;

  difficultySelect.value = currentDifficulty;
  themeSelect.value = theme;
  minesInput.value = numOfMines;
};

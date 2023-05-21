import gameState from '../game-state';
import difficulty from '../difficulty';
import { THEME } from '../constants';
import LocalStorage from '../local-store';

const STORAGE_KEY = 'minesweeper/theme';

let callbacks = null;
let form = null;
let minesInput = null;
let difficultySelect = null;
let themeSelect = null;

let currentDifficulty = null;
let numOfMines = null;

const themeStorage = new LocalStorage(STORAGE_KEY);
let theme = themeStorage.get() || THEME.LIGHT;

const changeTheme = (theme) => {
  gameState.theme = theme;
  document.querySelector('[data-theme]').dataset.theme = theme;
};

changeTheme(theme);

const handleThemeChange = (e) => {
  console.log('handleThemeChange', e.target.value);
  theme = e.target.value;
  changeTheme(theme);
  themeStorage.set(theme);
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
  numOfMines = Number(formData.get('mines'));
  theme = formData.get('theme');

  if (currentDifficulty !== gameState.difficultyKey || gameState.numOfMines !== numOfMines) {
    gameState.reset(currentDifficulty, numOfMines);
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

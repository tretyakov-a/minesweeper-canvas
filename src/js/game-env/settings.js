import difficulty from '../difficulty';
import { DIFFICULTY, THEME } from '../constants';
import LocalStorage from '../local-store';
import Volume from './volume';

class Settings extends EventTarget {
  constructor() {
    super();
    this.storage = new LocalStorage(Settings.STORAGE_KEY);
    const stored = this.storage.get() || {};

    const difficultyKey = stored.difficultyKey || DIFFICULTY.EASY;

    this.values = {
      volume: stored.volume || 0.3,
      theme: stored.theme || THEME.LIGHT,
      difficultyKey: difficultyKey,
      numOfMines: stored.numOfMines || difficulty[difficultyKey].mines,
    };
  }

  init() {
    const { volume, theme, difficultyKey, numOfMines } = this.values;
    this.volumeEl = new Volume(volume);
    this.volumeEl.addEventListener('volumeChange', this.handleVolumeChange);

    this.difficultySelect = document.querySelector('select[name="difficulty"]');
    this.difficultySelect.value = difficultyKey;
    this.difficultySelect.addEventListener('change', this.handleDifficultyChange);

    this.themeSelect = document.querySelector('select[name="theme"]');
    this.themeSelect.value = theme;
    this.themeSelect.addEventListener('change', this.handleThemeChange);

    this.minesInput = document.querySelector('.mines-input input[type="number"]');
    this.minesInput.value = numOfMines;

    this.form = document.querySelector('.settings__form');
    this.form.addEventListener('submit', this.handleFormSubmit);

    this.changeTheme();
    this.dispatchEvent(
      new CustomEvent('difficultyChange', { detail: { difficultyKey, numOfMines } })
    );
  }

  get difficultyKey() {
    return this._values.difficultyKey;
  }

  get theme() {
    return this._values.theme;
  }

  get volume() {
    return this._values.volume;
  }

  get values() {
    return this._values;
  }

  set values(newValues) {
    this._values = { ...this._values, ...newValues };
    this.saveToStorage();
  }

  handleVolumeChange = (e) => {
    this.values = { volume: e.detail.volume };
  };

  saveToStorage() {
    this.storage.set(this.values);
  }

  changeTheme = () => {
    const { theme } = this.values;
    document.querySelector('[data-theme]').dataset.theme = theme;
    this.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
  };

  handleThemeChange = (e) => {
    this.values = { theme: e.target.value };
    this.changeTheme();
  };

  handleDifficultyChange = (e) => {
    const { value } = e.target;
    if (value !== this.values.difficultyKey) {
      const defaultMines = difficulty[value].mines;
      this.values = { difficultyKey: value, numOfMines: defaultMines };
      this.minesInput.value = defaultMines;
    }
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    this.values = { numOfMines: Number(formData.get('mines')) };

    const { numOfMines, difficultyKey } = this.values;

    this.dispatchEvent(
      new CustomEvent('difficultyChange', { detail: { difficultyKey, numOfMines } })
    );
  };
}

Settings.STORAGE_KEY = 'minesweeper/settings';

export const settings = new Settings();

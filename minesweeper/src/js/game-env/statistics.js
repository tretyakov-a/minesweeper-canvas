import { DIFFICULTY, RESULT } from '../constants';
import { renderTime } from '../helpers';
import LocalStorage from '../local-store';
import tabContent from '@tpls/menu/stats/tab-content.ejs';
import { adjustMenuHeight } from './menu';

const NUMBER_OF_SAVED = 10;
const STORAGE_KEY = 'minesweeper/stats';

let tabTitles = {
  [DIFFICULTY.EASY]: null,
  [DIFFICULTY.MEDIUM]: null,
  [DIFFICULTY.EXPERT]: null,
};

let tabs = {
  ...tabTitles,
};

const storage = new LocalStorage(STORAGE_KEY);

let currentTab = DIFFICULTY.EASY;
let lastTimeGeneratedAmount = null;
let statistics = storage.get() || [];

const switchTab = (tabKey) => () => {
  currentTab = tabKey;
  closeTabs();
  tabs[tabKey].classList.add('show');
  tabTitles[tabKey].classList.add('active');
  adjustMenuHeight('stats');
};

const closeTabs = () => {
  Object.keys(tabs).forEach((tabKey) => {
    if (tabs[tabKey].classList.contains('show')) {
      tabs[tabKey].classList.remove('show');
    }
    tabTitles[tabKey].classList.remove('active');
  });
};

const findMinTime = (difficulty) => {
  const filtred = statistics.filter((stat) => stat.difficulty === difficulty);
  if (filtred.length === 0) return Infinity;
  return filtred.reduce((min, el) => (el.time < min.time ? el : min)).time;
};

const addStats = (gameResult) => {
  if (gameResult.result === RESULT.WIN) {
    statistics.push(gameResult);
    storage.set(statistics.slice(-NUMBER_OF_SAVED));
  }
};

const processClicks = (clicks) => {
  const { left, right, wasted, chords } = clicks;
  return `L:${left} (C:${chords}, W:${wasted}), R:${right}`;
};

const processStat = (statItem) => {
  const { time, date, clicks } = statItem;

  return {
    ...statItem,
    time: renderTime(time),
    date: new Date(date).toLocaleDateString('ru-RU'),
    clicks: processClicks(clicks),
  };
};

const generateStatsContent = () => {
  if (statistics.length === lastTimeGeneratedAmount) return;

  lastTimeGeneratedAmount = statistics.length;

  if (tabTitles.easy === null) {
    Object.keys(tabTitles).forEach((key) => {
      tabTitles[key] = document.querySelector(`[data-stats-tab-title="${key}"]`);
      tabTitles[key].addEventListener('click', switchTab(key));
      tabs[key] = document.querySelector(`[data-stats-tab="${key}"]`);
    });
  }

  Object.keys(tabs).forEach((difficultykey) => {
    const stats = statistics.filter((stat) => stat.difficulty === difficultykey).map(processStat);
    tabs[difficultykey].innerHTML = tabContent({ stats });
  });

  switchTab(currentTab)();
};

export { addStats, generateStatsContent, findMinTime };

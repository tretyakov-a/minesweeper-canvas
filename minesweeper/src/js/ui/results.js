import { renderTime } from '../helpers';
import renderModalContent from '@tpls/results/content.ejs';
// import { findMinTime } from './statistics';
import modalTemplate from '@tpls/results/index.ejs';
import titleTemplate from '@tpls/results/title.ejs';
import loseSrc from '@src/assets/lose.png';
import winSrc from '@src/assets/win.png';
import Modal from './modal';

let modal = null;
let title = null;
let content = null;

const winModificator = 'results_win';
const loseModificator = 'results_lose';

const resultMessage = (text, imgSrc) => titleTemplate({ imgSrc, text });

function renderContent(isWin, difficulty, time) {
  // const oldBestTime = findMinTime(difficulty);
  const oldBestTime = 0;
  const isNewBestTime = isWin && oldBestTime > time;

  return renderModalContent({
    isNewBestTime,
    oldBestTime: oldBestTime !== Infinity ? renderTime(oldBestTime) : 0,
    difficulty,
    time: renderTime(time),
  });
}

function showResults({ difficulty, result, time }) {
  const isWin = result === 'win';
  title.innerHTML = isWin ? resultMessage('Win!', winSrc) : resultMessage('Loss!', loseSrc);
  content.innerHTML = renderContent(isWin, difficulty, time);
  const resultModificator = isWin ? winModificator : loseModificator;
  modal.removeMods([winModificator, loseModificator]);
  modal.show([resultModificator]);
}

function initResults() {
  document.body.insertAdjacentHTML('afterbegin', modalTemplate());
  modal = new Modal('results');
  title = document.querySelector('.results__title');
  content = document.querySelector('.results__content');
}

export { showResults, initResults };

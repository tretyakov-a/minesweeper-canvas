import { renderTime } from '../helpers';
import renderModalContent from '@tpls/results/content.ejs';
import { findMinTime } from './statistics';
import modalTemplate from '@tpls/results/index.ejs';
import titleTemplate from '@tpls/results/title.ejs';
import Modal from './modal';
import { RESOURCES } from '../constants';
import { resources } from '../resources';

let modal = null;
let title = null;
let content = null;

const winModificator = 'results_win';
const loseModificator = 'results_lose';

const resultMessage = (text, imgSrc) => titleTemplate({ imgSrc, text });

function renderContent(isWin, data) {
  const oldBestTime = findMinTime(data.difficulty);
  const { time } = data;
  const isNewBestTime = isWin && oldBestTime > time;

  return renderModalContent({
    isNewBestTime,
    ...data,
    time: renderTime(time),
  });
}

function showResults(results) {
  const isWin = results.result === 'win';
  title.innerHTML = isWin
    ? resultMessage('Win!', resources.getImage(RESOURCES.WIN_ICON).src)
    : resultMessage('Loss!', resources.getImage(RESOURCES.LOSS_ICON).src);
  content.innerHTML = renderContent(isWin, results);
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

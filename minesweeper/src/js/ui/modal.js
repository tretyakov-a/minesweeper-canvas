import { isClickOutside, renderTime } from '../helpers';
import renderModalContent from '@tpls/modal/content.ejs';
// import { findMinTime } from './statistics';
import modalTemplate from '@tpls/modal/index.ejs';
import titleTemplate from '@tpls/modal/title.ejs';
import loseSrc from '@src/assets/lose.png';
import winSrc from '@src/assets/win.png';

let modal = null;
let title = null;
let content = null;

const showModificator = 'modal_show';
const hideModificator = 'modal_hide';
const winModificator = 'modal_win';
const loseModificator = 'modal_lose';
const animationDuration = 400;

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

function showModal({ difficulty, result, time }) {
  const isWin = result === 'win';
  title.innerHTML = isWin ? resultMessage('You won!', winSrc) : resultMessage('You lost!', loseSrc);
  content.innerHTML = renderContent(isWin, difficulty, time);
  const resultModificator = isWin ? winModificator : loseModificator;
  modal.classList.remove(winModificator, loseModificator);
  modal.classList.add(showModificator, resultModificator);
}

function hideModal() {
  modal.classList.remove(showModificator);
  modal.classList.add(hideModificator);

  setTimeout(() => {
    modal.classList.remove(hideModificator);
  }, animationDuration);
}

function initModal() {
  document.body.insertAdjacentHTML('afterbegin', modalTemplate());
  modal = document.querySelector('.modal');
  title = modal.querySelector('.modal__title');
  content = modal.querySelector('.modal__content');
  modal.querySelector('.modal__close-btn').addEventListener('click', hideModal);
}

export { showModal, initModal };

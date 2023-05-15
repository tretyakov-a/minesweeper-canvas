import header from '@tpls/header.ejs';
import footer from '@tpls/footer.ejs';
import main from '@tpls/main.ejs';

const initLayout = () => {
  document.body.insertAdjacentHTML('beforeend', header());
  document.body.insertAdjacentHTML('beforeend', main());
  document.body.insertAdjacentHTML('beforeend', footer());

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  const endGameMessage = document.createElement('div');
  endGameMessage.className = 'end-game-message';
  document.getElementById('game').prepend(resetBtn);
  document.getElementById('game').append(endGameMessage);
};

export default initLayout;

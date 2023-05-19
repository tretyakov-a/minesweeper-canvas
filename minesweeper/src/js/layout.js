import header from '@tpls/header.ejs';
import footer from '@tpls/footer.ejs';
import main from '@tpls/main.ejs';
import { initResults } from './ui/results';
import { initMenu } from './ui/menu';

const insert = (template) => {
  document.body.insertAdjacentHTML('beforeend', template);
};

const initLayout = () => {
  insert(header());
  insert(main());
  insert(footer());
  initResults();
  initMenu();
};

export default initLayout;

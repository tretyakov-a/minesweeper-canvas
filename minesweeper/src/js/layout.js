import header from '@tpls/header.ejs';
import footer from '@tpls/footer.ejs';
import main from '@tpls/main.ejs';
import { initModal } from './ui/modal';

const insert = (template) => {
  document.body.insertAdjacentHTML('beforeend', template);
};

const initLayout = () => {
  insert(header());
  insert(main());
  insert(footer());
  initModal();
};

export default initLayout;

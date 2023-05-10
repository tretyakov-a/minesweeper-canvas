import header from '@tpls/header.ejs';
import footer from '@tpls/footer.ejs';
import main from '@tpls/main.ejs';

const initLayout = () => {
  document.body.insertAdjacentHTML('beforeend', header());
  document.body.insertAdjacentHTML('beforeend', main());
  document.body.insertAdjacentHTML('beforeend', footer());
};

export default initLayout;

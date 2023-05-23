import menuTemplate from '@tpls/menu/index.ejs';
import Modal from './modal';

let callbacks = null;
let menuWindow = null;
let tabs = {
  help: null,
  stats: null,
  settings: null,
};
let buttons = {
  ...tabs,
};
let currentTab = null;
let modal = null;
let isMenuOpened = false;

const toggleMenu = (tabKey) => (e) => {
  e.stopPropagation();
  if (isMenuOpened && currentTab !== tabKey) {
    return switchTab(tabKey);
  }
  isMenuOpened = !isMenuOpened;
  if (isMenuOpened) {
    if (callbacks.onOpen) callbacks.onOpen();
    switchTab(tabKey);
    modal.show();
  } else {
    modal.hide();
  }
};

const adjustMenuHeight = (tabKey) => {
  const tabHeight = tabs[tabKey].offsetHeight;
  menuWindow.style.height = `${tabHeight}px`;
};

const switchTab = (tabKey) => {
  currentTab = tabKey;
  closeTabs();
  tabs[tabKey].classList.add('show');
  requestAnimationFrame(() => {
    adjustMenuHeight(tabKey);
  });
  buttons[tabKey].classList.add('active');
};

const closeTabs = () => {
  Object.keys(tabs).forEach((tabKey) => {
    if (tabs[tabKey].classList.contains('show')) {
      tabs[tabKey].classList.remove('show');
      tabs[tabKey].classList.add('hide');
      setTimeout(() => {
        tabs[tabKey].classList.remove('hide');
      }, modal.transition);
    }
    buttons[tabKey].classList.remove('active');
  });
};

const onHide = () => {
  isMenuOpened = false;
  currentTab = null;
  closeTabs();
  if (callbacks.onClose) callbacks.onClose();
};

const initMenu = (args) => {
  callbacks = args;

  document.body.insertAdjacentHTML('afterbegin', menuTemplate());

  modal = new Modal('menu', { hideOnClickOutside: true, onHide });
  menuWindow = document.querySelector('.menu__window');

  Object.keys(tabs).forEach((tabKey) => {
    tabs[tabKey] = document.querySelector(`[data-tab="${tabKey}"]`);
    buttons[tabKey] = document.querySelector(`[data-tab-button="${tabKey}"]`);
    buttons[tabKey].addEventListener('click', toggleMenu(tabKey));
  });
};

const hideMenu = () => {
  if (modal && isMenuOpened) modal.hide();
};

export { initMenu, hideMenu, adjustMenuHeight };

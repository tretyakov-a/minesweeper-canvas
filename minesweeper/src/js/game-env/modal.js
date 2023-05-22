import closeBtn from '@tpls/modal-close-btn.ejs';
import { isClickOutside } from '../helpers';

const defaultOptions = {
  hideOnClickOutside: false,
  onHide: null,
};

export default class Modal {
  constructor(className, options = {}) {
    this.options = { ...defaultOptions, ...options };
    this.container = document.querySelector(`.${className}`);

    this.container.querySelector('.modal__window').insertAdjacentHTML('afterbegin', closeBtn());
    document.querySelector('.modal__close-btn').addEventListener('click', this.hide);

    this.mods = {
      show: 'show',
      hide: 'hide',
    };
    this.transition = 400;
  }

  removeMods = (mods = []) => {
    this.container.classList.remove(...mods);
  };

  handleDocumentClick = (e) => {
    if (isClickOutside(e, ['modal__window'])) {
      this.hide();
    }
  };

  show = (showMods = []) => {
    this.additionalShowMods = showMods;
    const {
      options: { hideOnClickOutside },
    } = this;
    this.container.classList.add(this.mods.show, ...showMods);
    if (hideOnClickOutside) {
      document.addEventListener('click', this.handleDocumentClick);
    }
    document.body.classList.add('no-y-scroll');
  };

  hide = () => {
    const {
      mods,
      transition,
      container,
      options: { hideOnClickOutside, onHide },
    } = this;
    container.classList.remove(mods.show, ...this.additionalShowMods);
    container.classList.add(mods.hide);
    if (onHide) onHide();
    if (hideOnClickOutside) {
      document.removeEventListener('click', this.handleDocumentClick);
    }
    setTimeout(() => {
      container.classList.remove(mods.hide);
      document.body.classList.remove('no-y-scroll');
    }, transition);
  };
}

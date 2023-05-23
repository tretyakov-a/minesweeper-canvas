import WebFont from 'webfontloader';
import { THEME, RESOURCES } from './constants';
import { settings } from './game-env/settings';
import { loadSound, loadImage } from './helpers';

class Resources {
  constructor() {
    this.images = new Map();
    this.sounds = new Map();
  }

  addImage(key, src) {
    this.images.set(key, src);
  }

  getImage(key) {
    const themedKey = `${key}/${settings.theme}`;
    const hasThemedKey = this.images.has(themedKey);
    return this.images.get(hasThemedKey ? themedKey : key);
  }

  addSound(key, src) {
    this.sounds.set(key, src);
  }

  getSound(key) {
    return this.sounds.get(key);
  }

  playSound(key) {
    const sound = new Audio(this.getSound(key).src);
    sound.volume = settings.volume;
    sound.play();
  }

  load = async () => {
    await Promise.all(
      [...this.images.entries()].map(([key, src]) => {
        return new Promise((resolve) => {
          loadImage(`resources/images/${src}`).then((img) => {
            this.images.set(key, img);
            resolve();
          });
        });
      })
    );

    await Promise.all(
      [...this.sounds.entries()].map(([key, src]) => {
        return new Promise((resolve) => {
          loadSound(`resources/sounds/${src}`).then((sound) => {
            this.sounds.set(key, sound);
            resolve();
          });
        });
      })
    );

    await new Promise((resolve) => {
      WebFont.load({
        google: {
          families: ['Martian Mono:100,300,400,700'],
        },
        active: resolve,
      });
    });
  };
}

export const resources = new Resources();

resources.addImage(`${RESOURCES.MINE}/${THEME.LIGHT}`, 'mine-light.svg');
resources.addImage(`${RESOURCES.MINE}/${THEME.DARK}`, 'mine-dark.svg');
resources.addImage(`${RESOURCES.FLAG}/${THEME.LIGHT}`, 'flag-light.svg');
resources.addImage(`${RESOURCES.FLAG}/${THEME.DARK}`, 'flag-dark.svg');
resources.addImage(RESOURCES.PLAYING_ICON, 'playing.png');
resources.addImage(RESOURCES.LOSS_ICON, 'loss.png');
resources.addImage(RESOURCES.WIN_ICON, 'win.png');
resources.addImage(RESOURCES.MOUSE, 'hand.svg');
resources.addImage(RESOURCES.CLOCK, 'clock.svg');
resources.addImage(RESOURCES.EXPLOSION, 'explosion3.png');

resources.addSound(RESOURCES.SOUND.OPEN, 'open.mp3');
resources.addSound(RESOURCES.SOUND.CHORD, 'chord.mp3');
resources.addSound(RESOURCES.SOUND.BOOM, 'boom.mp3');
resources.addSound(RESOURCES.SOUND.WIN, 'win.mp3');
resources.addSound(RESOURCES.SOUND.LOSS, 'loss.mp3');
resources.addSound(RESOURCES.SOUND.FLAG, 'flag2.mp3');

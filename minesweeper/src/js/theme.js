import { THEME } from './constants';

export default {
  [THEME.LIGHT]: {
    bgColor: '#f0f2f5',
    primaryMediumColor: 'rgba(38, 115, 221, 0.2)',
    highlightMediumColor: 'rgba(255, 122, 69, 0.6)',
    borderColor: '#e8e8e8',
    textColor: 'rgba(0, 0, 0, 0.87)',
    cellBg: {
      opened: '#f0f2f5',
      closed: 'rgba(255, 122, 69, 0.6)',
      flagged: 'rgba(255, 122, 69, 0.6)',
      error: 'rgba(238, 44, 74, 0.5)',
      hightlight: 'rgba(255, 122, 69, 0.38)',
    },
    cellTextColor: [
      '#000000',
      '#00418d',
      '#00ba71',
      '#f43545',
      '#5f2879',
      '#ff8901',
      '#00c2de',
      '#fad717',
      'teal',
    ],
  },
  [THEME.DARK]: {
    bgColor: '#121212',
    primaryMediumColor: 'rgba(38, 115, 221, 0.3)',
    highlightMediumColor: 'rgba(255, 122, 69, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.09)',
    textColor: 'rgba(255, 255, 255, 0.87)',
    cellBg: {
      opened: '#272727',
      closed: 'rgba(38, 115, 221, 0.5)',
      flagged: 'rgba(38, 115, 221, 0.5)',
      error: 'rgba(238, 44, 74, 0.5)',
      hightlight: 'rgba(38, 115, 221, 0.3)',
    },
    cellTextColor: [
      '#000000',
      '#2673dd',
      '#00ba71',
      '#f43545',
      '#be29ec',
      '#ff8901',
      '#00c2de',
      '#fad717',
      'lightgrey',
    ],
  },
};

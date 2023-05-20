export default class LocalStorage {
  constructor(key) {
    this.key = key;
  }

  get() {
    const data = localStorage.getItem(this.key);
    if (data !== null) {
      try {
        return JSON.parse(data);
      } catch (error) {
        return console.log('Cant parse data from LS:', error.message);
      }
    }
  }

  set(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}

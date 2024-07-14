export default class Task {
  constructor(text) {
    this.id = performance.now();
    this.text = text;
    this.pin = false;
  }
}

/* eslint-disable @typescript-eslint/ban-types */
export default class Observable {
  observers: Function[];
  constructor() {
    this.observers = [];
  }

  subscribe(func: Function) {
    this.observers.push(func);
  }

  unsubscribe(func: Function) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data?: unknown) {
    if (data) {
      this.observers.forEach((observer) => observer(data));
    } else {
      this.observers.forEach((observer) => observer());
    }
  }
}

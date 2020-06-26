import { Event } from './event.js'

export class CustomEvent extends Event {
  initCustomEvent(type, bubbles, cancelable, detail) {
    this.initEvent(type, bubbles, cancelable);
    this.detail = detail;
  }
}



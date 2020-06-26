export class Event {
  constructor (type, eventInitDict = {}) {
    this.type = type;

    this.bubbles = eventInitDict.bubbles || false
    this.cancelable = eventInitDict.cancelable || false
    this.composeed = eventInitDict.composeed || false

    this.target = null
    this.currentTarget = null

    this.isTrusted = false
    this.timeStamp = Date.now()
  }

  get srcElement() {
    return this.target;
  }

  get defaultPrevented() {
    return this._canceledFlag;
  }

  stopPropagation() {
    // todo?
  }

  get cancelBubble() {
    return false // todo?
  }

  set cancelBubble(v) {
    // todo?
  }

  stopImmediatePropagation() {
    // todo?
  }

  preventDefault() {
    // todo?
  }

  composedPath() {
    return [this.target]
  }

  initEvent(type, bubbles, cancelable) {
    this.type = type;
    this.isTrusted = false;
    this.target = null;
    this.bubbles = bubbles || false;
    this.cancelable = cancelable || false;
  }
}

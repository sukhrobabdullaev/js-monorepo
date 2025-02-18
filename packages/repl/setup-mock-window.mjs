import { EventEmitter } from "events";

global.window = Object.assign(new EventEmitter(), {
  location: { href: "http://localhost/" },
  addEventListener(event, handler) {
    this.on(event, handler);
  },
  removeEventListener(event, handler) {
    this.off(event, handler);
  },
  dispatchEvent(event) {
    this.emit(event.type, event);
  },
  history: {
    replaceState() {},
    pushState() {},
  },
});

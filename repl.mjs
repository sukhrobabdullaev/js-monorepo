import { start } from "repl";
import { EventEmitter } from "events";

// Mock a minimal `window` object with event handling
global.window = Object.assign(new EventEmitter(), {
  location: { href: "http://localhost/" },
  addEventListener: function (event, handler) {
    this.on(event, handler);
  },
  removeEventListener: function (event, handler) {
    this.off(event, handler);
  },
  dispatchEvent: function (event) {
    this.emit(event.type, event);
  },
  history: {
    replaceState: function () {}, // Prevents the `replaceState` error
    pushState: function () {},
  },
});

// Mock localStorage
global.localStorage = {
  _store: new Map(),
  getItem: (key) => global.localStorage._store.get(key) || null,
  setItem: (key, value) => global.localStorage._store.set(key, value),
  removeItem: (key) => global.localStorage._store.delete(key),
  clear: () => global.localStorage._store.clear(),
};

// Import the API after setting up mocks
const api = await import("./packages/api/dist/esm/index.js");


console.log("REPL going. Try `near.` <tab>");

// Start a REPL session
const r = start({
  prompt: "» ",
  useGlobal: true,
  useColors: true,
});
// Expose API to REPL
r.context.near = api;

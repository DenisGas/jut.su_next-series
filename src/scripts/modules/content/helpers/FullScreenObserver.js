class FullScreenObserver {
  #callbacks = new Set();

  constructor() {
    document.addEventListener('fullscreenchange', this.#handleChange);
  }

  #handleChange = () => {
    const { isFullScreen } = this;
    this.#callbacks.forEach((cb) => cb(isFullScreen));
  };

  get isFullScreen() {
    return !!document.fullscreenElement;
  }

  subscribe(callback) {
    this.#callbacks.add(callback);
  }

  unsubscribe(callback) {
    this.#callbacks.delete(callback);
  }
}

const fullScreenObserver = new FullScreenObserver();
export default fullScreenObserver;

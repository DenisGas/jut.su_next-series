class MouseManager {
  #timeoutId = null;

  #isHidden = false;

  #isEnabled = false;

  #hideDelay = 2700;

  #lastPosition = { x: 0, y: 0 };

  #videoElement;

  constructor(videoElement) {
    this.#videoElement = videoElement;

    document.addEventListener('mousemove', this.#handleMouseMove);

    if (this.#videoElement) {
      this.#videoElement.addEventListener('pause', this.#showCursor);
      this.#videoElement.addEventListener('play', this.#resetHideTimer);
    }
  }

  enable() {
    if (this.#isEnabled) return;
    this.#isEnabled = true;
    this.#resetHideTimer();
  }

  disable() {
    this.#isEnabled = false;
    this.#showCursor();
  }

  #handleMouseMove = (event) => {
    const { clientX: x, clientY: y } = event;
    const moved = x !== this.#lastPosition.x || y !== this.#lastPosition.y;

    if (moved) {
      this.#showCursor();
      this.#resetHideTimer();
    }

    this.#lastPosition = { x, y };
  };

  #hideCursor = () => {
    if (!this.#isHidden && this.#isEnabled && !this.#videoElement.paused) {
      document.body.style.cursor = 'default';
      setTimeout(() => {
        document.body.style.cursor = 'none';
      }, 10);
      this.#isHidden = true;
    }
  };

  #showCursor = () => {
    if (this.#isHidden) {
      document.body.style.cursor = '';
      this.#isHidden = false;
    }
  };

  #resetHideTimer = () => {
    clearTimeout(this.#timeoutId);
    if (!this.#videoElement.paused) {
      this.#timeoutId = setTimeout(() => this.#hideCursor(), this.#hideDelay);
    }
  };
}

export default MouseManager;

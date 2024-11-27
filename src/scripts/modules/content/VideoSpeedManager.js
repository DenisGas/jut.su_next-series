// VideoSpeedManager.js
import BaseManager from './BaseManager.js';

class VideoSpeedManager extends BaseManager {
  #videoElement;
  #intervalIds = [];
  #config;
  #playbackRate = 1.0;

  constructor(videoElement) {
    super();
    this.#videoElement = videoElement;
  }

  disable() {
    const speedControl = document.querySelector(".vjs-control.speed");
    if (this.#videoElement) {
      if (speedControl) {
        speedControl?.remove();
      }
      this.#videoElement.playbackRate = 1.0;
    }
  }


  addSpeedControl() {
    if (!this.#videoElement) {
      return;
    }
    const controlBar = document.querySelector(".vjs-control-bar");
    if (!controlBar) return;

    let speedControl = document.querySelector(".vjs-control.speed");
    if (!speedControl) {
      this.createSpeedControl().then((control) => {
        if (control) {
          const volumePanel = controlBar.querySelector(
            ".vjs-volume-panel.vjs-control"
          );

          if (volumePanel) {
            controlBar.insertBefore(control, volumePanel.nextSibling);
          } else {
            controlBar.appendChild(control);
          }

          // Встановлюємо швидкість з глобальної змінної, якщо є
          if (this.#playbackRate) {
            this.#videoElement.playbackRate = this.#playbackRate;
          }
        }
      });
    }
  }


  async createSpeedControl() {
    const speedControl = document.createElement("div");
    speedControl.className = "vjs-control speed";

    const speeds = [0.5, 1.0, 1.5, 2.0];
    let currentSpeed = this.#playbackRate;

    const speedButton = document.createElement("button");
    speedButton.className = "vjs-control vjs-button";
    speedButton.textContent = `${currentSpeed.toFixed(1)}x`;
    speedButton.title = "Скорость воспроизведения";

    const speedRange = document.createElement("input");
    speedRange.type = "range";
    speedRange.className = "speed-range";
    speedRange.min = "0.5";
    speedRange.max = "2.0";
    speedRange.step = "0.1";
    speedRange.value = currentSpeed.toFixed(1);

    speedButton.addEventListener("click", () => {
      let nextSpeedIndex = (speeds.indexOf(currentSpeed) + 1) % speeds.length;
      currentSpeed = speeds[nextSpeedIndex];
      speedButton.textContent = `${currentSpeed.toFixed(1)}x`;
      speedRange.value = currentSpeed;
      this.#videoElement.playbackRate = currentSpeed;
      this.#playbackRate = currentSpeed; // Оновлюємо глобальну змінну
    });

    speedRange.addEventListener("input", () => {
      currentSpeed = parseFloat(speedRange.value);
      speedButton.textContent = `${currentSpeed.toFixed(1)}x`;
      this.#videoElement.playbackRate = currentSpeed;
      this.#playbackRate = currentSpeed; // Оновлюємо глобальну змінну
    });

    speedControl.appendChild(speedButton);
    speedControl.appendChild(speedRange);
    return speedControl;
  }


  start() {
    if (this.#videoElement) {
      this.#videoElement.playbackRate = this.#playbackRate || 1.0;
    }
    this.addSpeedControl();
  }


  update() {
    this.disable();
  }
}

export default VideoSpeedManager;

import BaseManager from './BaseManager';
import storage from '../common/storage';

class VideoSpeedManager extends BaseManager {
  #videoElement;

  constructor(videoElement) {
    super();
    this.#videoElement = videoElement;
  }

  async updatePlaybackRate(rate) {
    if (this.#videoElement) {
      this.#videoElement.playbackRate = rate;
      // console.log('Updated playback rate:', rate);
    }
  }

  async savePlaybackRate(rate) {
    await storage.setLocalItem('videoPlaybackRate', rate);
    // console.log('Saved playback rate:', rate);
  }

  async loadPlaybackRate() {
    if (!this.#videoElement) return;

    try {
      const storedValue = await storage.getLocalItem('videoPlaybackRate');
      let rate = parseFloat(storedValue);

      if (!storedValue || Number.isNaN(rate) || rate <= 0) {
        rate = 1.0;
        await this.savePlaybackRate(rate);
      }

      this.updatePlaybackRate(rate);
    } catch (error) {
      console.error('Failed to load playback rate:', error);
    }
  }

  async setPlaybackRate(newRate) {
    const rate = parseFloat(newRate);
    if (Number.isNaN(rate) || rate <= 0) return;

    if (this.#videoElement && this.#videoElement.playbackRate === rate) {
      return;
    }

    await this.savePlaybackRate(rate);
    this.updatePlaybackRate(rate);

    const speedButton = document.querySelector('.vjs-control.speed button');
    if (speedButton) {
      speedButton.textContent = `${rate.toFixed(1)}x`;
    }
  }

  async start() {
    await this.loadPlaybackRate();
    this.addSpeedControl();
  }

  disable() {
    this.updatePlaybackRate(1.0);
    // console.log('Playback rate reset to default (1.0)');
    this.removeSpeedControl();
  }

  async addSpeedControl() {
    if (!this.#videoElement) return;

    const controlBar = document.querySelector('.vjs-control-bar');
    if (!controlBar) return;

    const existingSpeedControl = document.querySelector('.vjs-control.speed');
    if (existingSpeedControl) return;

    const speedControl = await this.createSpeedControl();
    if (speedControl) {
      const volumePanel = controlBar.querySelector(
        '.vjs-volume-panel.vjs-control'
      );
      if (volumePanel) {
        controlBar.insertBefore(speedControl, volumePanel.nextSibling);
      } else {
        controlBar.appendChild(speedControl);
      }
    }
  }

  removeSpeedControl() {
    const speedControl = document.querySelector('.vjs-control.speed');
    if (speedControl) {
      speedControl.remove();
    }
  }

  async createSpeedControl() {
    const speedControl = document.createElement('div');
    speedControl.className = 'vjs-control speed';

    const speeds = [0.5, 1.0, 1.5, 2.0];

    const savedSpeed =
      parseFloat(await storage.getLocalItem('videoPlaybackRate')) || 1.0;

    // if (!savedSpeed || Number.isNaN(savedSpeed) || savedSpeed <= 0) {
    //   rate = 1.0;
    //   await this.savePlaybackRate(rate);
    // }

    // if (!speeds.includes(savedSpeed)) {
    //   savedSpeed = 1.0;
    // }

    const speedButton = document.createElement('button');
    speedButton.className = 'vjs-control vjs-button';
    speedButton.textContent = `${savedSpeed.toFixed(1)}x`;
    speedButton.title = 'Скорость воспроизведения';

    const speedRange = document.createElement('input');
    speedRange.type = 'range';
    speedRange.className = 'speed-range';
    speedRange.min = '0.5';
    speedRange.max = '2.0';
    speedRange.step = '0.1';
    speedRange.value = savedSpeed.toFixed(1);

    const roundToNearestSpeed = (value) =>
      speeds.reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );

    speedButton.addEventListener('click', () => {
      let currentValue = parseFloat(speedRange.value);
      if (!speeds.includes(currentValue)) {
        currentValue = roundToNearestSpeed(currentValue);
      } else {
        const currentIndex = speeds.indexOf(currentValue);
        currentValue = speeds[(currentIndex + 1) % speeds.length];
      }
      speedRange.value = currentValue;
      speedButton.textContent = `${currentValue.toFixed(1)}x`;
      this.setPlaybackRate(currentValue);
    });

    speedRange.addEventListener('input', () => {
      const newSpeed = parseFloat(speedRange.value);
      speedButton.textContent = `${newSpeed.toFixed(1)}x`;
      this.setPlaybackRate(newSpeed);
    });

    speedControl.appendChild(speedButton);
    speedControl.appendChild(speedRange);
    return speedControl;
  }

  update() {
    console.log('update');
  }
}

export default VideoSpeedManager;

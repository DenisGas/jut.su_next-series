// SkipIntroManager.js
import BaseManager from './BaseManager';

class SkipIntroManager extends BaseManager {
  #videoElement;

  #fixInfinityLoadFlag = false;

  #videoData;

  #intervalIds = [];

  constructor(videoElement, videoData) {
    super();
    this.#videoElement = videoElement;
    this.#videoData = videoData;
  }

  checkVideoElement() {
    if (this.#videoElement) {
      console.log('ok');
    } else {
      console.log('no ok');
      this.#videoElement = document.querySelector('video');
    }
  }

  skipIntro(skipIntroBtn, fixInfinityLoad = false) {
    this.disable();
    const checkSkipIntroBtnVisible = setInterval(() => {
      if (
        !skipIntroBtn.classList.contains('vjs-hidden') ||
        (this.#videoElement.currentTime >
          parseInt(this.#videoData.video_intro_start, 10) &&
          this.#videoElement.currentTime <
            parseInt(this.#videoData.video_intro_end, 10))
      ) {
        this.checkVideoElement();
        console.log('skip');
        skipIntroBtn.click();
        if (fixInfinityLoad) {
          if (
            this.#videoElement.paused === false &&
            this.#fixInfinityLoadFlag === false
          ) {
            this.#videoElement.pause();
            setTimeout(() => {
              this.#videoElement.play();
              this.#fixInfinityLoadFlag = true;
              console.log('fix infinity load applied');
            }, 500);
          }
        }
      }
    }, 1000);
    this.#intervalIds.push(checkSkipIntroBtnVisible);
  }

  update() {
    this.disable();
  }

  disable() {
    this.#intervalIds.forEach(clearInterval);
    this.#intervalIds = [];
  }
}

export default SkipIntroManager;

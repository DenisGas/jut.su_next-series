// SkipIntroManager.js
import BaseManager from './BaseManager.js';

class SkipIntroManager extends BaseManager{
  #videoElement;
  #videoData;
  #intervalIds = [];

  constructor(videoElement, videoData) {
    super();
    this.#videoElement = videoElement;
    this.#videoData = videoData;
  }

  skipIntro(skipIntroBtn) {
    this.disable();
    const checkSkipIntroBtnVisible = setInterval(() => {
      if (
        !skipIntroBtn.classList.contains("vjs-hidden") ||
        (this.#videoElement.currentTime >
          parseInt(this.#videoData.video_intro_start) &&
          this.#videoElement.currentTime <
            parseInt(this.#videoData.video_intro_end))
      ) {
        skipIntroBtn.click();
      }
    }, 1000);
    this.#intervalIds.push(checkSkipIntroBtnVisible);
  }

  update(){
    this.disable();
  }

  disable() {
    this.#intervalIds.forEach(clearInterval);
    this.#intervalIds = [];
  }
}

export default SkipIntroManager;

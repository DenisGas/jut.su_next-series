// VideoSpeedManager.js
import BaseManager from './BaseManager.js';

class VideoSpeedManager extends BaseManager{
    #videoElement;
    #intervalIds = [];
    #config;
  
    constructor(videoElement) {
      super();
      this.#videoElement = videoElement;
    }
  
    #loadPlaybackRate() {
        return new Promise((resolve, reject) => {
          if (!this.#videoElement) {
            reject("Video element is not available.");
            return;
          }
    
          chrome.storage.sync.get("videoPlaybackRate", (result) => {
            if (chrome.runtime.lastError) {
              reject(`Error fetching storage: ${chrome.runtime.lastError.message}`);
              return;
            }
    
            const rate = result.videoPlaybackRate;
            if (rate) {
              this.#videoElement.playbackRate = rate;
            }
            resolve(this.#videoElement.playbackRate);
          });
        });
      }
  
    disable() {
        const speedControl = document.querySelector(".vjs-control.speed");
        if (this.#videoElement) {
          if (speedControl) {
            if (this.#config.addSpeedControl === false) {
              speedControl?.remove();
            }
          }
          this.#videoElement.playbackRate = 1.0;
        }
    }
  }
  
  export default VideoSpeedManager;
  
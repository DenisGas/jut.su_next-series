// ShortCatsManager.js

class ShortCatsManager {
    #videoElement;
    #intervalIds = [];
  
    constructor(videoElement) {
      this.#videoElement = videoElement;
    }
  
    nextSeriesBeforeEnd(nextSerBtn) {
      this.disable();
      const checkVideoEnded = setInterval(() => {
        if (
          this.#videoElement.ended ||
          !nextSerBtn.classList.contains("vjs-hidden")
        ) {
          clearInterval(checkVideoEnded);
          nextSerBtn.click();
        }
      }, 1000);
      this.#intervalIds.push(checkVideoEnded);
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
      this.#intervalIds.forEach(clearInterval);
      this.#intervalIds = [];
    }
  }
  
  export default ShortCatsManager;
  
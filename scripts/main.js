class JutsuExtension {
  constructor() {
    this.intervalIds = [];
    this.btnSkipIntroCanBeClick = true;
    this.fullScreenBtnCanBeClick = true;
    this.config = {};
  }

  async init() {
    window.addEventListener("load", async () => {
      if (this.workOnThisPage(window.location.href)) {
        this.config = await this.storage();

        chrome.storage.onChanged.addListener(async (changes, namespace) => {
          // console.log(changes, namespace);
          this.config = await this.storage();
          this.main();
        });

        if (!this.config.extensionEnabled) {
          this.disableExtension();
          return;
        }

        this.checkVideo();
      }
    });
  }

  async storage() {
    const DefaultConfig = {
      extensionEnabled: true,
      nextSeriesBeforeEnd: true,
      nextSeriesAfterEnd: false,
      skipIntro: true,
      clickToFullScreen: false,
      videoFromStart: false,
    };

    return new Promise((resolve, reject) => {
      chrome.storage.local.get("jutsuExtensionConfig", async (result) => {
        if (result.jutsuExtensionConfig === undefined) {
          await new Promise((resolve) => {
            chrome.storage.local.set({ jutsuExtensionConfig: DefaultConfig }, resolve);
          });
          resolve(DefaultConfig);
        } else {
          resolve(result.jutsuExtensionConfig);
        }
      });
    });
  }

  disableExtension() {
    const div = document.querySelector(".extension-overlay-div");
    if (div) {
      div.style.display = "none";
    }
    this.clearAllIntervals();
  }

  playVideo(video) {
    video.play();
  }

  checkVideo() {
    const checkVideoElemOnPage = setInterval(() => {
      const video = document.getElementById("my-player_html5_api");
      if (video) {
        clearInterval(checkVideoElemOnPage);
        this.playVideo(video);
        this.checkForFullScreenButton();
        if (this.config.videoFromStart) {
          this.videoFromStart(video);
        }
      }
    }, 100);
  }

  checkForFullScreenButton() {
    const checkForFullScreenButtonInterval = setInterval(() => {
      const fullScreenButton = document.querySelector(".vjs-fullscreen-control");
      if (fullScreenButton) {
        clearInterval(checkForFullScreenButtonInterval);
        this.setupFullScreenButton(fullScreenButton);
        this.main();
      }
    }, 100);
  }

  setupFullScreenButton(fullScreenButton) {
    fullScreenButton.addEventListener('click', () => {
      document.getElementById("my-player_html5_api").focus();
    });

    document.addEventListener('keydown', (event) => {
      if (event.code === "KeyF") {
        const message = document.querySelector('#message');
        const search = document.querySelector('input[type="text"][name="ystext"]');
        if (message !== document.activeElement && search !== document.activeElement) {
          this.goFullScreen();
        }
      }
    });
  }

  goFullScreen() {
    const fullScreenControl = document.querySelector(".vjs-fullscreen-control");
    fullScreenControl.click();
  }

  createOverlayBtn(bool) {
    const div = document.querySelector(".extension-overlay-div");
    if (!div) {
      if (!bool) {
        return;
      }
  
      const overlayDiv = document.createElement("div");
      overlayDiv.classList.add("extension-overlay-div");
      document.body.appendChild(overlayDiv);
  
      const fullScreenBtn = document.createElement("button");
      fullScreenBtn.classList.add("extension-overlay-button");
      fullScreenBtn.textContent = "Click to FullScreen";
      overlayDiv.appendChild(fullScreenBtn);
  
      const exitBtn = document.createElement("button");
      exitBtn.classList.add("extension-overlay-exit-button");
      exitBtn.textContent = "Exit";
      overlayDiv.appendChild(exitBtn);
  
      const closeOverlay = () => {
        overlayDiv.style.display = "none";
        this.fullScreenBtnCanBeClick = false;
        document.removeEventListener('fullscreenchange', closeOverlay);
        document.getElementById("my-player_html5_api").focus();
      };
  
      document.addEventListener('fullscreenchange', closeOverlay);
  
      fullScreenBtn.onclick = () => {
        overlayDiv.style.display = "none";
        const fullScreenControl = document.querySelector(".vjs-fullscreen-control");
        fullScreenControl.classList.remove("vjs-hidden");
        fullScreenControl.click();
        this.fullScreenBtnCanBeClick = false;
        document.removeEventListener('fullscreenchange', closeOverlay);
      };
  
      exitBtn.onclick = closeOverlay;
    } else {
      div.remove();
      this.createOverlayBtn(bool);
    }
  }
  
  

  workOnThisPage(websitePage) {
    return websitePage.includes("episode-") || websitePage.includes("film-");
  }

  clearAllIntervals() {
    for (const intervalId of this.intervalIds) {
      clearInterval(intervalId);
    }
    this.intervalIds = [];
  }

  videoFromStart(video) {
    const checkVideoTimeNotZero = setInterval(() => {
      if(video.currentTime > 0){
        video.currentTime = 0.2;
        clearInterval(checkVideoTimeNotZero);
      }
    }, 1000);
  }

  nextSeriesBeforeEnd(nextSerBtn) {
    const checkVideoEnded = setInterval(() => {
      if (document.getElementById("my-player_html5_api").ended === true || nextSerBtn.classList.contains("vjs-hidden") !== true) {
        clearInterval(checkVideoEnded);
        nextSerBtn.click();
      }
    }, 1000);
    this.intervalIds.push(checkVideoEnded);
  }

  nextSeriesAfterEnd(nextSerBtn) {
    const checkVideoEnded = setInterval(() => {
      if (document.getElementById("my-player_html5_api").ended === true) {
        clearInterval(checkVideoEnded);
        nextSerBtn.click();
      }
    }, 1000);
    this.intervalIds.push(checkVideoEnded);
  }

  // skipIntroOneTime(skipIntroBtn) {
  //   const checkSkipIntroBtnVisible = setInterval(() => {
  //     if (skipIntroBtn.classList.contains("vjs-hidden") !== true) {
  //       clearInterval(checkSkipIntroBtnVisible);
  //       skipIntroBtn.click();
  //     }
  //   }, 1000);
  //   this.intervalIds.push(checkSkipIntroBtnVisible);
  // }

  skipIntro(skipIntroBtn) {
    const checkSkipIntroBtnVisible = setInterval(() => {
      if (skipIntroBtn.classList.contains("vjs-hidden") !== true) {
        skipIntroBtn.click();
      }
    }, 1000);
    this.intervalIds.push(checkSkipIntroBtnVisible);
  }


  main() {
    this.clearAllIntervals();
    if (!this.config.extensionEnabled) {
      this.disableExtension();
      return;
    }

    const nextSerBtn = document.querySelector(".vjs-overlay-bottom-right");
    const skipIntroBtn = document.querySelector(".vjs-overlay-bottom-left");

    const { nextSeriesBeforeEnd, nextSeriesAfterEnd, skipIntro, clickToFullScreen } = this.config;

    if (this.fullScreenBtnCanBeClick) {
      this.createOverlayBtn(clickToFullScreen);
    }

    if (skipIntroBtn && skipIntro && this.btnSkipIntroCanBeClick) {
      this.skipIntro(skipIntroBtn);
    }

    if (nextSerBtn) {
      if (nextSeriesBeforeEnd){
        this.nextSeriesBeforeEnd(nextSerBtn);
      }else if (nextSeriesAfterEnd){
        this.nextSeriesAfterEnd(nextSerBtn);
      }
      
    }

  }
}

const jutsuExtension = new JutsuExtension();
jutsuExtension.init();

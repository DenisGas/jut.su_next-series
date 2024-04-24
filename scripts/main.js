class JutsuExtension {
  #intervalIds = [];
  #config = {};
  #videoData = {};
  #videoElement = null;
  #btnSkipIntroCanBeClick = true;
  #fullScreenBtnCanBeClick = true;

  constructor() {
    this.init();
  }

  async init() {
    window.addEventListener("load", async () => {
      if (this.#workOnThisPage(window.location.href)) {
        this.#config = await this.#loadConfig();

        chrome.storage.onChanged.addListener(async (changes) => {
          this.#config = await this.#loadConfig();
          this.#main();
        });

        if (!this.#config.extensionEnabled) {
          this.#disableExtension();
          return;
        }

        this.#checkVideo();
      }
    });
  }

  async #loadConfig() {
    const DefaultConfig = {
      extensionEnabled: true,
      nextSeriesBeforeEnd: true,
      nextSeriesAfterEnd: false,
      skipIntro: true,
      clickToFullScreen: false,
      videoFromStart: false,
      addSpeedControl: false,
      markVideoTimeLine: true
    };

    return new Promise((resolve) => {
      chrome.storage.local.get("jutsuExtensionConfig", (result) => {
        if (result.jutsuExtensionConfig === undefined) {
          chrome.storage.local.set({ jutsuExtensionConfig: DefaultConfig }, () => {
            resolve(DefaultConfig);
          });
        } else {
          resolve(result.jutsuExtensionConfig);
        }
      });
    });
  }

  #disableExtension() {
    const div = document.querySelector(".extension-overlay-div");
    if (div !== null) {
      div.style.display = "none";
    }

    this.#clearAllIntervals();
    this.#clearTimeLineMarks();
    this.#removeSpeedControl();
  }

  #extractVideoData() {
    const scripts = document.querySelectorAll("script");
    let videoData = {};

    scripts.forEach((script) => {
      const hasPviewId = /pview_id\s*=\s*"\d+";/;
      if (hasPviewId.test(script.innerText)) {
        let code = script.innerText;
        const base64StartIndex = code.indexOf("Base64.decode(") + 15;
        const base64EndIndex = code.indexOf(")");

        const base64String = code.substring(base64StartIndex, base64EndIndex).trim();
        const decodedString = atob(base64String.replace(/"/g, ""));

        decodedString.split(";").filter(line => line.trim() !== "").forEach(line => {
          const [key, value] = line.trim().split("=");
          if (key && value) {
            videoData[key.trim()] = value.trim().replace(/"/g, "");
          }
        });
      }
    });

    return videoData;
  }

  #markVideoTimeLine() {
    console.log(this.#videoData);
    if (!this.#videoElement || !this.#videoData || !this.#config.markVideoTimeLine) {
      this.#clearTimeLineMarks(); // Удаляет отметки, если функция выключена
      return;
    }
    const progressHolder = document.querySelector(".vjs-progress-holder.vjs-slider.vjs-slider-horizontal");
    if (!progressHolder) return;

    this.#clearTimeLineMarks(); // Очистка предыдущих отметок

    const segments = [
      {
        id: "intro",
        start: parseInt(this.#videoData.video_intro_start),
        end: parseInt(this.#videoData.video_intro_end),
        color: "yellow"
      },
      {
        id: "outro",
        start: parseInt(this.#videoData.video_outro_start),
        // end: parseInt(this.#videoData.this_video_duration),
        end: parseInt(this.#videoData.video_outro_start),
        color: "red"
      }
    ];

    segments.forEach(segment => {
      const existingLine = document.getElementById(segment.id);
      if (existingLine) return;

      const markLine = document.createElement("div");
      markLine.id = segment.id;
      markLine.className = "mark-line";
      markLine.style.position = "absolute";
      markLine.style.width = "4px";
      if (segment.end - segment.start !== 0) {
        markLine.style.width = `${((segment.end - segment.start) / parseInt(this.#videoData.this_video_duration)) * 100}%`;
      }
      markLine.style.height = "100%";
      markLine.style.left = `${(segment.start / parseInt(this.#videoData.this_video_duration)) * 100}%`;
      markLine.style.background = `${segment.color}`;

      progressHolder.appendChild(markLine);
    });

  }

  // addSpeedControl(videoElement) {
  //   console.log(videoElement);
  //   const controlBar = document.querySelector(".vjs-control-bar");
  //   if (controlBar) {
  //     const speedControl = document.querySelector(".vjs-control.speed");
  //     if (speedControl) {
  //       return;
  //     }
  //     const speedDiv = document.createElement("div");
  //     speedDiv.className = "vjs-control speed";

  //     function findExactIndex(array, target) {
  //       const index = array.indexOf(target);
  //       return index !== -1 ? index : undefined;
  //     }

  //     const speeds = [0.5, 1.0, 1.5, 2.0];

  //     let currentSpeedIndex = findExactIndex(speeds, videoElement.playbackRate.toFixed(1));



  //     const speedButton = document.createElement("button");
  //     speedButton.className = "vjs-control vjs-button";

  //     speedButton.textContent = videoElement.playbackRate.toFixed(1) + 'x';

  //     if (currentSpeedIndex !== undefined) {
  //       speedButton.textContent = currentSpeedIndex.toFixed(1) + 'x';
  //     }

  //     speedButton.title = "Скорость воспроизведения";

  //     const speedRange = document.createElement("input");
  //     speedRange.type = "range";
  //     speedRange.min = "0.5";
  //     speedRange.max = "2.0";
  //     speedRange.step = "0.1";
  //     speedRange.value = currentSpeedIndex !== undefined ? speeds[currentSpeedIndex].toFixed(1) : videoElement.playbackRate.toFixed(1);
  //     speedRange.className = "speed-range";

  //     // Округление до ближайшего стандартного значения
  //     function roundToNearestSpeed(value) {
  //       return speeds.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
  //     }

  //     // Обработчик события клика на кнопке
  //     speedButton.addEventListener("click", function () {
  //       let currentSpeed = parseFloat(speedRange.value);
  //       if (!speeds.includes(currentSpeed)) {
  //         currentSpeed = roundToNearestSpeed(currentSpeed);
  //       } else {
  //         currentSpeedIndex = (speeds.indexOf(currentSpeed) + 1) % speeds.length;
  //         currentSpeed = speeds[currentSpeedIndex];
  //       }
  //       speedRange.value = currentSpeed;
  //       speedButton.textContent = currentSpeed.toFixed(1) + 'x';
  //       videoElement.playbackRate = currentSpeed;
  //     });

  //     // Обработчик события input на ползунке
  //     speedRange.addEventListener("input", function () {
  //       const newSpeed = parseFloat(this.value);
  //       speedButton.textContent = newSpeed.toFixed(1) + 'x';
  //       videoElement.playbackRate = newSpeed;
  //     });

  //     speedDiv.appendChild(speedButton);
  //     speedDiv.appendChild(speedRange);


  //   }
  // }


  #addSpeedControl() {
    if (!this.#videoElement || !this.#config.addSpeedControl) {
      this.#removeSpeedControl(); // Удаляет элементы управления скоростью, если функция выключена
      return;
    }
    const controlBar = document.querySelector(".vjs-control-bar");
    if (!controlBar) return;

    let speedControl = document.querySelector(".vjs-control.speed");
    if (!speedControl) {
      speedControl = this.#createSpeedControl();

      const volumePanel = controlBar.querySelector(".vjs-volume-panel.vjs-control");

      if (volumePanel) {
        controlBar.insertBefore(speedControl, volumePanel.nextSibling);
      } else {
        controlBar.appendChild(speedControl);
      }
    }
  }

  #createSpeedControl() {
    const speedControl = document.createElement("div");
    speedControl.className = "vjs-control speed";
    const speeds = [0.5, 1.0, 1.5, 2.0];
    let currentSpeed = this.#videoElement.playbackRate;
    currentSpeed = speeds.includes(currentSpeed) ? currentSpeed : 1.0;

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
      let index = speeds.indexOf(parseFloat(speedRange.value));
      index = (index + 1) % speeds.length;
      speedRange.value = speeds[index].toFixed(1);
      this.#videoElement.playbackRate = speeds[index];
      speedButton.textContent = `${speeds[index].toFixed(1)}x`;
    });

    speedRange.addEventListener("input", () => {
      this.#videoElement.playbackRate = parseFloat(speedRange.value);
      speedButton.textContent = `${speedRange.value}x`;
    });

    speedControl.appendChild(speedButton);
    speedControl.appendChild(speedRange);
    return speedControl;
  }



  #removeSpeedControl() {
    const speedControl = document.querySelector(".vjs-control.speed");
    speedControl?.remove();
  }

  #clearTimeLineMarks() {
    document.querySelectorAll(".mark-line").forEach(mark => mark.remove());
  }

  #playVideo() {
    this.#videoElement.play();
  }

  #checkVideo() {
    const checkVideoElemOnPage = setInterval(() => {
      const video = document.getElementById("my-player_html5_api");
      if (video) {
        clearInterval(checkVideoElemOnPage);
        this.#videoElement = video;
        this.#playVideo();
        this.#checkForFullScreenButton();
        if (this.#config.videoFromStart) {
          this.#videoFromStart();
        }
        this.#videoData = this.#extractVideoData();
      }
    }, 100);
  }

  #checkForFullScreenButton() {
    const checkForFullScreenButtonInterval = setInterval(() => {
      const fullScreenButton = document.querySelector(".vjs-fullscreen-control");
      if (fullScreenButton) {
        clearInterval(checkForFullScreenButtonInterval);
        this.#setupFullScreenButton(fullScreenButton);
        this.#main();
      }
    }, 100);
  }

  #setupFullScreenButton(fullScreenButton) {
    fullScreenButton.addEventListener("click", () => {
      this.#videoElement.focus();
    });

    document.addEventListener("keydown", (event) => {
      if (event.code === "KeyF" && document.activeElement !== document.querySelector("#message") && document.activeElement !== document.querySelector('input[type="text"][name="ystext"]')) {
        this.#goFullScreen();
      }
    });
  }

  #goFullScreen() {
    const fullScreenControl = document.querySelector(".vjs-fullscreen-control");
    fullScreenControl.click();
  }

  #createOverlayBtn(bool) {
    let div = document.querySelector(".extension-overlay-div");
    if (!div) {
      if (!bool) return;

      const overlayDiv = document.createElement("div");
      overlayDiv.className = "extension-overlay-div";
      document.body.appendChild(overlayDiv);

      const fullScreenBtn = this.#createButton("Click to FullScreen", "extension-overlay-button");
      overlayDiv.appendChild(fullScreenBtn);

      const exitBtn = this.#createButton("Exit", "extension-overlay-exit-button");
      overlayDiv.appendChild(exitBtn);

      const closeOverlay = () => {
        overlayDiv.style.display = "none";
        this.#fullScreenBtnCanBeClick = false;
        document.removeEventListener("fullscreenchange", closeOverlay);
        this.#videoElement.focus();
      };

      document.addEventListener("fullscreenchange", closeOverlay);

      fullScreenBtn.onclick = () => {
        overlayDiv.style.display = "none";
        const fullScreenControl = document.querySelector(".vjs-fullscreen-control");
        fullScreenControl.classList.remove("vjs-hidden");
        fullScreenControl.click();
        this.#fullScreenBtnCanBeClick = false;
        document.removeEventListener("fullscreenchange", closeOverlay);
      };

      exitBtn.onclick = closeOverlay;
    } else {
      div.remove();
      this.#createOverlayBtn(bool);
    }
  }

  #createButton(text, className) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = className;
    return button;
  }

  #workOnThisPage(websitePage) {
    return websitePage.includes("episode-") || websitePage.includes("film-");
  }

  #clearAllIntervals() {
    for (const intervalId of this.#intervalIds) {
      clearInterval(intervalId);
    }
    this.#intervalIds = [];
  }

  #videoFromStart() {
    const checkVideoTimeNotZero = setInterval(() => {
      if (this.#videoElement.currentTime > 0) {
        this.#videoElement.currentTime = 0.2;
        clearInterval(checkVideoTimeNotZero);
      }
    }, 1000);
  }

  #nextSeriesBeforeEnd(nextSerBtn) {
    const checkVideoEnded = setInterval(() => {
      if (this.#videoElement.ended || !nextSerBtn.classList.contains("vjs-hidden")) {
        clearInterval(checkVideoEnded);
        nextSerBtn.click();
      }
    }, 1000);
    this.#intervalIds.push(checkVideoEnded);
  }

  #nextSeriesAfterEnd(nextSerBtn) {
    const checkVideoEnded = setInterval(() => {
      if (this.#videoElement.ended) {
        clearInterval(checkVideoEnded);
        nextSerBtn.click();
      }
    }, 1000);
    this.#intervalIds.push(checkVideoEnded);
  }

  #skipIntro(skipIntroBtn) {
    if (!this.#videoData) {
      this.#videoData = this.#extractVideoData();
    }

    const checkSkipIntroBtnVisible = setInterval(() => {
      if (!skipIntroBtn.classList.contains("vjs-hidden") || (this.#videoElement.currentTime > parseInt(this.#videoData.video_intro_start) && this.#videoElement.currentTime < parseInt(this.#videoData.video_intro_end))) {
        skipIntroBtn.click();
      }
    }, 1000);
    this.#intervalIds.push(checkSkipIntroBtnVisible);
  }

  #main() {
    this.#clearAllIntervals();
    this.#removeSpeedControl();
    this.#clearTimeLineMarks();
    if (!this.#config.extensionEnabled) {
      this.#disableExtension();
      return;
    }

    const nextSerBtn = document.querySelector(".vjs-overlay-bottom-right");
    const skipIntroBtn = document.querySelector(".vjs-overlay-bottom-left");

    console.log(this.#config)

    if (this.#config.markVideoTimeLine) {
      console.log(this.#config.markVideoTimeLine);
      this.#markVideoTimeLine();
    }

    if (this.#config.addSpeedControl) {
      this.#addSpeedControl();
    }

    if (this.#fullScreenBtnCanBeClick) {
      this.#createOverlayBtn(this.#config.clickToFullScreen);
    }

    if (skipIntroBtn && this.#config.skipIntro && this.#btnSkipIntroCanBeClick) {
      this.#skipIntro(skipIntroBtn);
    }

    if (nextSerBtn) {
      if (this.#config.nextSeriesBeforeEnd) {
        this.#nextSeriesBeforeEnd(nextSerBtn);
      } else if (this.#config.nextSeriesAfterEnd) {
        this.#nextSeriesAfterEnd(nextSerBtn);
      }
    }
  }
}

const jutsuExtension = new JutsuExtension();
jutsuExtension.init();
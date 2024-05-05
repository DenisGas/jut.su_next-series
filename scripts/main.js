class JutsuExtension {
  #saveRateTimeout = null;
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
        this.#config.canBePseudoFullscreen = await this.#loadCanBePseudoFullscreen();


        chrome.storage.onChanged.addListener(async (changes) => {
          this.#config = await this.#loadConfig();
          this.#config.canBePseudoFullscreen = await this.#loadCanBePseudoFullscreen();
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
      markVideoTimeLine: true,
      pseudoFullscreen: false,
    };

    return new Promise((resolve) => {
      chrome.storage.sync.get("jutsuExtensionConfig", (result) => {
        if (result.jutsuExtensionConfig === undefined) {
          chrome.storage.sync.set(
            { jutsuExtensionConfig: DefaultConfig },
            () => {
              resolve(DefaultConfig);
            }
          );
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

    this.#deactivateKinoMode();
    this.#removeKinoModeToggle();

    this.#clearAllIntervals();
    this.#clearTimeLineMarks();
    this.#removeSpeedControl();
  }

  #removeKinoModeToggle() {
    const kinoToggleBtn = document.querySelector(".vjs-kino-toggle");
    if (kinoToggleBtn) kinoToggleBtn.remove();
  }

  #addStyles() {
    if (document.getElementById("kino-styles")) {
      return;
    }
    const style = document.createElement('style');
    style.id = 'kino-styles';
    style.innerHTML = `
    .hidden { display: none; }
    #my-player {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      width: 100dvw !important;
      height: 100dvh !important;
      z-index: 9999 !important;
      background-color: black !important;
      outline: none !important;
      padding: 1vh 0 !important;

    }
  `;
    document.head.appendChild(style);
  }


  #removeStyles() {
    const style = document.getElementById('kino-styles');
    if (style) {
      style.remove();
    }
  }

  async #loadCanBePseudoFullscreen() {
    return new Promise((resolve) => {
      chrome.storage.sync.get("canBePseudoFullscreen", (result) => {
        if (result.canBePseudoFullscreen === undefined) {
          chrome.storage.sync.set({ canBePseudoFullscreen: true }, () => {
            resolve(true);
          });
        } else {
          resolve(result.canBePseudoFullscreen);
        }
      });
    });
  }

  #saveCanBePseudoFullscreen(value) {
    chrome.storage.sync.set({ canBePseudoFullscreen: value });
  }

  #updateKinoMode() {
    if (this.#config.pseudoFullscreen && this.#config.canBePseudoFullscreen) {
      this.#activateKinoMode();
    } else {
      this.#deactivateKinoMode();
    }
    if (!this.#config.pseudoFullscreen) {
      const shareButton = document.querySelector('.vjs-share-control');
      if (shareButton) {
        shareButton.style.display = "";
      }
    }
  }

  #manageKinoModeToggle() {
    const controlBar = document.querySelector(".vjs-control-bar");
    if (!controlBar) return;

    let kinoToggleBtn = document.querySelector(".vjs-kino-toggle");
    if (this.#config.pseudoFullscreen) {
      if (!kinoToggleBtn) {
        kinoToggleBtn = this.#createKinoToggleButton();
        controlBar.appendChild(kinoToggleBtn);
      }
      this.#updateKinoButton(kinoToggleBtn);
    } else {
      if (kinoToggleBtn) kinoToggleBtn.remove();
    }
  }

  #updateKinoButton(button) {
    const icon = button.querySelector(".kino-mode-icon");
    if (this.#config.canBePseudoFullscreen) {
      icon.classList.add("cancel");
      icon.classList.remove("kino");
      button.title = "Disable cinema mode";
    } else {
      icon.classList.add("kino");
      icon.classList.remove("cancel");
      button.title = "Enable cinema mode";
    }
  }

  #activateKinoMode() {
    this.#addStyles();
    document.querySelectorAll(".sidebar, .slicknav_menu, .header, .logo_b, .info_panel, .achiv_switcher, .video_plate_title, .header_video, .all_anime_title.aat_ep, .footer")
      .forEach(el => el.style.display = "none");
  }

  #deactivateKinoMode() {
    this.#removeStyles();
    document.querySelectorAll(".sidebar, .slicknav_menu, .header, .logo_b, .info_panel, .achiv_switcher, .video_plate_title, .header_video, .all_anime_title.aat_ep, .footer")
      .forEach(el => el.style.display = "");
    this.#scrollToPlayer();

  }

  #createKinoToggleButton() {
    const shareButton = document.querySelector('.vjs-share-control');
    if (shareButton) {
      shareButton.style.display = "none";
    }
    const button = document.createElement("button");
    button.className = "vjs-control vjs-kino-toggle";
    button.innerHTML = '<span class="kino-mode-icon kino"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-30"></use><path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z" fill="#fff" fill-rule="evenodd" id="ytp-id-30"></path></svg></span>';
    button.title = "Toggle cinema mode availability";

    button.addEventListener("click", () => {
      this.#config.canBePseudoFullscreen = !this.#config.canBePseudoFullscreen;
      this.#saveCanBePseudoFullscreen(this.#config.canBePseudoFullscreen);
      this.#updateKinoButton(button);
    });
    return button;
  }

  #scrollToPlayer() {
    const player = document.getElementById('my-player');
    if (player) {
      player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  #extractVideoData() {
    const scripts = document.querySelectorAll("script");
    let videoData = {};
    let sum = "";
    scripts.forEach((script) => {
      // sum += script.innerText;
      const hasPviewId = /pview_id\s*=\s*".*?";/;
      // const hasPviewId = /pview_id\s*=\s*"\d+";/;
      if (hasPviewId.test(script.innerText)) {
        let code = script.innerText;
        // console.log(code)
        const base64StartIndex = code.indexOf("Base64.decode(") + 15;
        const base64EndIndex = code.indexOf(")");

        const base64String = code
          .substring(base64StartIndex, base64EndIndex)
          .trim();
        const decodedString = atob(base64String.replace(/"/g, ""));

        decodedString
          .split(";")
          .filter((line) => line.trim() !== "")
          .forEach((line) => {
            const [key, value] = line.trim().split("=");
            if (key && value) {
              videoData[key.trim()] = value.trim().replace(/"/g, "");
            }
          });
      }
    });

    // console.log(sum);

    return videoData;
  }

  #markVideoTimeLine() {
    if (!this.#videoElement || !this.#videoData || Object.keys(this.#videoData).length === 0) {
      console.log("No video element or data available.");
      return;
    }

    const progressHolder = document.querySelector(".vjs-progress-holder.vjs-slider.vjs-slider-horizontal");
    if (!progressHolder) {
      console.log("No progress holder found.");
      return;
    }

    const segments = [
      {
        id: "intro",
        start: parseInt(this.#videoData.video_intro_start),
        end: parseInt(this.#videoData.video_intro_end),
        color: "yellow",
      },
      {
        id: "outro",
        start: parseInt(this.#videoData.video_outro_start),
        // end: parseInt(this.#videoData.this_video_duration),
        end: parseInt(this.#videoData.video_outro_start),
        color: "red",
      },
    ];

    segments.forEach((segment) => {
      if (isNaN(segment.start) || isNaN(segment.end) || segment.end < segment.start) {
        console.log(`Skipping invalid segment: ${segment.id}`);
        return;
      }

      const existingLine = document.getElementById(segment.id);
      if (existingLine) return;

      const markLine = document.createElement("div");
      markLine.id = segment.id;
      markLine.className = "mark-line";
      markLine.style.position = "absolute";
      markLine.style.width = "4px";
      if (segment.end - segment.start !== 0) {
        markLine.style.width = `${((segment.end - segment.start) /
          parseInt(this.#videoData.this_video_duration)) *
          100
          }%`;
      }
      markLine.style.height = "100%";
      markLine.style.left = `${(segment.start / parseInt(this.#videoData.this_video_duration)) * 100
        }%`;
      markLine.style.background = `${segment.color}`;

      progressHolder.appendChild(markLine);
    });
  }

  #savePlaybackRate(rate) {
    // Очистка предыдущего таймаута, чтобы избежать излишних сохранений
    clearTimeout(this.#saveRateTimeout);

    this.#saveRateTimeout = setTimeout(() => {
      // Проверяем, не уничтожен ли контекст выполнения
      if (chrome.runtime.lastError) {
        console.error(`Error saving playback rate: ${chrome.runtime.lastError.message}`);
        return;
      }

      chrome.storage.sync.set({ videoPlaybackRate: rate }, () => {
        if (chrome.runtime.lastError) {
          console.error(`Error saving playback rate: ${chrome.runtime.lastError.message}`);
        } else {
          console.log(`Playback rate saved: ${rate}`);
        }
      });
    }, 1000);  // Уменьшенное время задержки для быстрого сохранения, но с предотвращением излишних операций
  }

  #addSpeedControl() {
    if (!this.#videoElement) {
      return;
    }
    const controlBar = document.querySelector(".vjs-control-bar");
    if (!controlBar) return;

    let speedControl = document.querySelector(".vjs-control.speed");
    if (!speedControl) {
      this.#createSpeedControl().then((control) => {
        if (control) {
          const volumePanel = controlBar.querySelector(
            ".vjs-volume-panel.vjs-control"
          );

          // control.addEventListener("mouseleave", () => {
          //   this.#savePlaybackRate(this.#videoElement.playbackRate);
          // });

          if (volumePanel) {
            controlBar.insertBefore(control, volumePanel.nextSibling);
          } else {
            controlBar.appendChild(control);
          }
        }
      });
    }
  }

  async #createSpeedControl() {
    const speedControl = document.createElement("div");
    speedControl.className = "vjs-control speed";
    const speeds = [0.5, 1.0, 1.5, 2.0];
    // let currentSpeed = this.#videoElement.playbackRate;
    let currentSpeed = await this.#loadPlaybackRate();
    // currentSpeed = speeds.includes(currentSpeed) ? currentSpeed : 1.0;

    const speedButton = document.createElement("button");
    speedButton.className = "vjs-control vjs-button";
    speedButton.textContent = `${currentSpeed.toFixed(1)}x`;
    speedButton.title = "Скорость воспроизведения";

    function findExactIndex(array, target) {
      const index = array.indexOf(target);
      return index !== -1 ? index : undefined;
    }

    let currentSpeedIndex = findExactIndex(
      speeds,
      this.#videoElement.playbackRate.toFixed(1)
    );

    speedButton.textContent = this.#videoElement.playbackRate.toFixed(1) + "x";

    if (currentSpeedIndex !== undefined) {
      speedButton.textContent = currentSpeedIndex.toFixed(1) + "x";
    }

    // console.log(currentSpeed);

    const speedRange = document.createElement("input");
    speedRange.type = "range";
    speedRange.className = "speed-range";
    speedRange.min = "0.5";
    speedRange.max = "2.0";
    speedRange.step = "0.1";
    // speedRange.value = currentSpeed.toFixed(1);
    speedRange.value =
      currentSpeedIndex !== undefined
        ? speeds[currentSpeedIndex].toFixed(1)
        : this.#videoElement.playbackRate.toFixed(1);

    function roundToNearestSpeed(value) {
      return speeds.reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );
    }

    speedButton.addEventListener("click", () => {
      let currentSpeed = parseFloat(speedRange.value);
      if (!speeds.includes(currentSpeed)) {
        currentSpeed = roundToNearestSpeed(currentSpeed);
      } else {
        currentSpeedIndex = (speeds.indexOf(currentSpeed) + 1) % speeds.length;
        currentSpeed = speeds[currentSpeedIndex];
      }
      speedRange.value = currentSpeed;
      speedButton.textContent = `${currentSpeed.toFixed(1)}x`;
      this.#videoElement.playbackRate = currentSpeed;
      this.#savePlaybackRate(this.#videoElement.playbackRate);
    });

    speedRange.addEventListener("input", () => {
      this.#videoElement.playbackRate = parseFloat(speedRange.value);
      speedButton.textContent = `${parseFloat(speedRange.value).toFixed(1)}x`;
      this.#savePlaybackRate(this.#videoElement.playbackRate);
    });

    speedControl.appendChild(speedButton);
    speedControl.appendChild(speedRange);
    return speedControl;
  }

  #removeSpeedControl() {
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

  #clearTimeLineMarks() {
    document.querySelectorAll(".mark-line").forEach((mark) => mark.remove());
  }

  #playVideo() {
    this.#videoElement.play();
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


  #findVideoElement(callback) {
    const checkVideoElemOnPage = setInterval(() => {
      const video = document.getElementById("my-player_html5_api");
      if (video) {
        clearInterval(checkVideoElemOnPage);
        callback(video);
      }
    }, 100);
  }

  #initializeVideoFeatures(video) {
    this.#videoElement = video;
    this.#playVideo();
    this.#checkForFullScreenButton();
    if (this.#config.videoFromStart) {
      this.#videoFromStart();
    }
    this.#videoData = this.#extractVideoData();
  }

  #checkVideo() {
    this.#findVideoElement(this.#initializeVideoFeatures.bind(this));
  }

  #checkForFullScreenButton() {
    const checkForFullScreenButtonInterval = setInterval(() => {
      const fullScreenButton = document.querySelector(
        ".vjs-fullscreen-control"
      );
      if (fullScreenButton) {
        clearInterval(checkForFullScreenButtonInterval);
        this.#setupFullScreenButton(fullScreenButton);
        this.#main();
      }
    }, 100);
  }


  #createShortCat(key, func, excludeSelectors = []) {
    document.addEventListener("keydown", (event) => {
      if (event.code === key && !excludeSelectors.some(selector => document.activeElement === document.querySelector(selector))) {
        func(event);
      }
    });
  }

  #setupShortcuts() {
    this.#createShortCat("KeyF", () => {
      this.#goFullScreen();
    }, ["#message", 'input[type="text"][name="ystext"]']);

    this.#createShortCat("KeyT", () => {
      const pseudoFullScreenButton = document.querySelector(".vjs-kino-toggle");
      if (pseudoFullScreenButton) {
        pseudoFullScreenButton.click(); 
        this.#videoElement.focus();
      }
    }, ["#message", 'input[type="text"][name="ystext"]']);
  }


  #setupFullScreenButton(fullScreenButton) {
    fullScreenButton.addEventListener("click", () => {
      this.#videoElement.focus();
    });

    this.#setupShortcuts();

  }

  #goFullScreen() {
    const fullScreenControl = document.querySelector(".vjs-fullscreen-control");
    fullScreenControl.click();
    this.#videoElement.focus();
  }

  #createOverlayBtn(bool) {
    let div = document.querySelector(".extension-overlay-div");
    if (!div) {
      if (!bool) return;

      const overlayDiv = document.createElement("div");
      overlayDiv.className = "extension-overlay-div";
      document.body.appendChild(overlayDiv);

      const fullScreenBtn = this.#createButton(
        chrome.i18n.getMessage("fullScreen"),
        "extension-overlay-button"
      );
      overlayDiv.appendChild(fullScreenBtn);

      const exitBtn = this.#createButton(
        chrome.i18n.getMessage("exit"),
        "extension-overlay-exit-button"
      );
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
        const fullScreenControl = document.querySelector(
          ".vjs-fullscreen-control"
        );
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

  #main() {

    this.#clearAllIntervals();
    this.#removeSpeedControl();
    this.#clearTimeLineMarks();
    if (!this.#config.extensionEnabled) {
      this.#disableExtension();
      return;
    }

    if (!this.#videoElement) {
      this.#checkVideo();
      return;
    }

    this.#manageKinoModeToggle();
    this.#updateKinoMode();

    const nextSerBtn = document.querySelector(".vjs-overlay-bottom-right");
    const skipIntroBtn = document.querySelector(".vjs-overlay-bottom-left");

    // console.log(this.#config);

    if (this.#config.markVideoTimeLine) {
      // console.log(this.#config.markVideoTimeLine);
      this.#markVideoTimeLine();
    }

    if (this.#config.addSpeedControl) {
      this.#addSpeedControl();
    }

    if (this.#fullScreenBtnCanBeClick) {
      this.#createOverlayBtn(this.#config.clickToFullScreen);
    }

    if (
      skipIntroBtn &&
      this.#config.skipIntro &&
      this.#btnSkipIntroCanBeClick
    ) {
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
// jutsuExtension.init();

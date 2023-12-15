const intervalIds = [];
let btnSkipIntroCanBeClick = true;
let fullScreenBtnCanBeClick = true;

window.addEventListener("load", function () {
  if (workOnThisPage(window.location.href) != false) {
    (async () => {
      const config = await storage();

      chrome.storage.onChanged.addListener(function (changes, namespace) {
        console.log(changes, namespace);
        (async () => {
          const config = await storage();
          main(config);
        })();
      });

      if (config.isExtensionON === false) {
        extensionOff();
        return;
      }

      const checkVideoElemOnPage = setInterval(() => {

        const video = document.getElementById("my-player_html5_api");

        if (video) {

          clearInterval(checkVideoElemOnPage);
          playVideo(video);

          const checkForFullScreenButton = setInterval(() => {
            if (document.querySelector(".vjs-fullscreen-control")) {
              clearInterval(checkForFullScreenButton);

              document.querySelector(".vjs-fullscreen-control").addEventListener('click', () => video.focus());
              document.addEventListener('keydown', function (event) {
                if (event.code === "KeyF") {
                  const message = document.querySelector('#message');
                  const search = document.querySelector('input[type="text"][name="ystext"]');
                  if (message !== document.activeElement && search !== document.activeElement) {
                    goFullScreen();
                  }

                }
              });
              main(config);
            }
          }, 100);

          if (config.videoFromStartBool) {
            videoFromStart(video);
          }
        }
      }, 100);
    })();
  }
});

async function storage() {
  const jutsuExtensionDefaultConfig = {
    isExtensionON: true,
    nextSeriesBeforeEndBool: true,
    nextSeriesAfterEndBool: false,
    skipIntroBool: true,
    clickToFullScreenBool: false,
    videoFromStartBool: false,
  };

  return new Promise((resolve, reject) => {
    chrome.storage.local.get("jutsuExtensionConfig", async (result) => {
      if (result.jutsuExtensionConfig === undefined) {
        await new Promise((resolve) => {
          chrome.storage.local.set(
            { jutsuExtensionConfig: jutsuExtensionDefaultConfig },
            resolve
          );
        });
        resolve(jutsuExtensionDefaultConfig);
      } else {
        resolve(result.jutsuExtensionConfig);
      }
    });
  });
}

function extensionOff() {
  const div = document.querySelector(".extension-overlay-div");
  if (div) {
    div.style.display = "none";
  }
  clearAllIntervals();
}

function playVideo(video) {
  video.play();
}

function createInterval(callback, delay) {
  const intervalId = setInterval(callback, delay);
  intervalIds.push(intervalId);
  return intervalId;
}

function clearAllIntervals() {
  for (let i = 0; i < intervalIds.length; i++) {
    clearInterval(intervalIds[i]);
  }
  intervalIds.length = 0;
}

function videoFromStart(video) {
  let checkVideoTimeNotZero = setInterval(function () {
    if (video.currentTime != 0) {
      video.currentTime = 0;
      clearInterval(checkVideoTimeNotZero);
    }
  }, 1000);
}

function goFullScreen() {
  const fullScreenControl = document.querySelector(
    ".vjs-fullscreen-control"
  );
  fullScreenControl.click();

}

function createOverlayBtn(bool) {
  const div = document.querySelector(".extension-overlay-div");
  if (!div) {
    if (!bool) {
      return;
    }

    const div = document.createElement("div");
    div.classList.add("extension-overlay-div");

    document.body.appendChild(div);

    const fullScreenBtn = document.createElement("button");
    fullScreenBtn.classList.add("extension-overlay-button");
    fullScreenBtn.textContent = "Click to FullScreen";

    div.appendChild(fullScreenBtn);

    const exitBtn = document.createElement("button");
    exitBtn.classList.add("extension-overlay-exit-button");
    exitBtn.textContent = "Exit";

    div.appendChild(exitBtn);

    const fullscreenChangeHandler = () => {
      if (exitBtn) {
        exitBtn.click();
      }
    };

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);


    fullScreenBtn.onclick = (event) => {
      div.style.display = "none";
      const fullScreenControl = document.querySelector(
        ".vjs-fullscreen-control"
      );
      fullScreenControl.classList.remove("vjs-hidden");
      fullScreenControl.click();
      fullScreenBtnCanBeClick = false;
    };
    exitBtn.onclick = (event) => {
      div.style.display = "none";
      fullScreenBtnCanBeClick = false;
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
      document.getElementById("my-player_html5_api").focus();
    };
  } else {
    div.remove();
    return createOverlayBtn(bool);
  }
}


function workOnThisPage(websitePage) {
  if (websitePage.includes("episode-") || websitePage.includes("film-")) {
    return true;
  }
  return false;
}


function nextSeries(
  nextSerBtn,
  nextSeriesAfterEndBool,
  nextSeriesBeforeEndBool
) {
  if (nextSeriesAfterEndBool) {
    let checkVideoEnded = createInterval(() => {
      if (document.getElementById("my-player_html5_api").ended === true) {
        clickElement(nextSerBtn, checkVideoEnded);
      }
    }, 1000);
  }

  if (nextSeriesBeforeEndBool) {
    let checkVideoEnded = createInterval(() => {
      if (
        document.getElementById("my-player_html5_api").ended === true ||
        nextSerBtn.classList.contains("vjs-hidden") !== true
      ) {
        clickElement(nextSerBtn, checkVideoEnded);
      }
    }, 1000);
  }
}

function skipIntro(skipIntroBtn) {
  let checkSkipIntroBtnVisible = createInterval(() => {
    if (skipIntroBtn.classList.contains("vjs-hidden") != true) {
      // btnSkipIntroCanBeClick = false;
      skipIntroBtn.click();
      // clickElement(skipIntroBtn, checkSkipIntroBtnVisible);
    }
  }, 1000);
}

function clickElement(element, intervalFunc) {
  clearInterval(intervalFunc);
  element.click();
}

function main(configObject) {
  clearAllIntervals();
  const isExtensionON = configObject.isExtensionON;
  if (isExtensionON === false) {
    extensionOff();
    return;
  }
  const nextSerBtn = document.querySelector(".vjs-overlay-bottom-right");
  const skipIntroBtn = document.querySelector(".vjs-overlay-bottom-left");

  const nextSeriesBeforeEndBool = configObject.nextSeriesBeforeEndBool;
  const nextSeriesAfterEndBool = configObject.nextSeriesAfterEndBool;
  const skipIntroBool = configObject.skipIntroBool;
  const clickToFullScreenBool = configObject.clickToFullScreenBool;

  if (fullScreenBtnCanBeClick) {
    createOverlayBtn(clickToFullScreenBool);
  }

  if (skipIntroBtn && skipIntroBool && btnSkipIntroCanBeClick) {
    skipIntro(skipIntroBtn);
  }

  if (nextSerBtn) {
    nextSeries(nextSerBtn, nextSeriesAfterEndBool, nextSeriesBeforeEndBool);
  }
}

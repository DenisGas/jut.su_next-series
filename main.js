const intervalIds = [];
let btnSkipIntroCanBeClick = true;

window.addEventListener("load", function () {
  const page = window.location.href;
  if (workOnThisPage(page) != false) {
    (async () => {
      const config = await storage();

      const video = document.querySelector("#my-player_html5_api");

      playVideo(video);

      if (config.videoFromStartBool) {
        videoFromStart(video);
      }
      createCssBlock();
      main(config);
    })();
  }
});

async function storage() {
  const jutsuExtensionDefaultConfig = {
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

function createCssBlock() {
  const styles = `
      .extension-overlay-div {
        position: fixed;
        top: 0;
        left: 0;
        width:100%;
        height:100%;
        border: none;
        z-index: 9999;
        display:flex;
      }

      .extension-overlay-div button:hover{
        filter: brightness(0.8);
      }

      .extension-overlay-button{
        cursor:pointer;
        border: none;
        padding:0;
        color: white;
        background-color: #485f4880;
        width:60%;
        height:100%;
      }

      .extension-overlay-exit-button{
        cursor:pointer;
        border: none;
        padding:0;
        color: white;
        width:40%;
        height:100%;
        background-color: #9d363680;
      }
      `;
  const styleElement = document.createElement("style");
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = styles;
  } else {
    styleElement.appendChild(document.createTextNode(styles));
  }
  document.head.appendChild(styleElement);
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
    fullScreenBtn.textContent = "Click to fullScreen";

    div.appendChild(fullScreenBtn);

    const exitBtn = document.createElement("button");
    exitBtn.classList.add("extension-overlay-exit-button");
    exitBtn.textContent = "Exit";

    div.appendChild(exitBtn);

    fullScreenBtn.onclick = (event) => {
      div.style.display = "none";
      const fullScreenControl = document.querySelector(
        ".vjs-fullscreen-control"
      );
      fullScreenControl.classList.remove("vjs-hidden");
      fullScreenControl.click();
    };
    exitBtn.onclick = (event) => {
      div.style.display = "none";
    };
  } else {
    div.remove();
    return createOverlayBtn(bool);
  }
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  // console.log(changes, namespace);
  (async () => {
    const config = await storage();
    main(config);
  })();
});

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
      if (document.querySelector("#my-player_html5_api").ended === true) {
        clickElement(nextSerBtn, checkVideoEnded);
      }
    }, 3000);
  }

  if (nextSeriesBeforeEndBool) {
    let checkVideoEnded = createInterval(() => {
      if (
        document.querySelector("#my-player_html5_api").ended === true ||
        nextSerBtn.classList.contains("vjs-hidden") !== true
      ) {
        clickElement(nextSerBtn, checkVideoEnded);
      }
    }, 3000);
  }
}

function skipIntro(skipIntroBtn) {
  let checkSkipIntroBtnVisible = createInterval(() => {
    if (skipIntroBtn.classList.contains("vjs-hidden") != true) {
      btnSkipIntroCanBeClick = false;
      clickElement(skipIntroBtn, checkSkipIntroBtnVisible);
    }
  }, 2000);
}

function clickElement(element, intervalFunc) {
  clearInterval(intervalFunc);
  element.click();
}

function main(configObject) {
  clearAllIntervals();

  const nextSerBtn = document.querySelector(".vjs-overlay-bottom-right");
  const skipIntroBtn = document.querySelector(".vjs-overlay-bottom-left");

  const nextSeriesBeforeEndBool = configObject.nextSeriesBeforeEndBool;
  const nextSeriesAfterEndBool = configObject.nextSeriesAfterEndBool;
  const skipIntroBool = configObject.skipIntroBool;
  const clickToFullScreenBool = configObject.clickToFullScreenBool;

  createOverlayBtn(clickToFullScreenBool);

  if (skipIntroBtn && skipIntroBool && btnSkipIntroCanBeClick) {
    skipIntro(skipIntroBtn);
  }

  if (nextSerBtn) {
    nextSeries(nextSerBtn, nextSeriesAfterEndBool, nextSeriesBeforeEndBool);
  }
}

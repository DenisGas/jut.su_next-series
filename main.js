window.addEventListener("load", function () {
  let page = window.location.href;
  let refactoredEpisodeString = getRefactoredEpisodeString(page);
  if (refactoredEpisodeString != null) {
    storage();
    let video = document.querySelector("#my-player_html5_api");
    video.play();
  }
});

function storage() {
  const jutsuExtensionDefaultConfig = {
    nextSeriesBeforeEndBool: true,
    nextSeriesAfterEndBool: false,
    skipIntroBool: true,
    clickToFullScreenBool: false,
  };

  chrome.storage.local.get(["jutsuExtensionConfig"], (result) => {
    if (result.jutsuExtensionConfig == undefined) {
      chrome.storage.local.set({
        jutsuExtensionConfig: jutsuExtensionDefaultConfig,
      });
      return storage();
    }

    const config = result.jutsuExtensionConfig;

    return main(config);
  });
}

function createOverlayBtn(bool) {
  if (!document.querySelector(".extension-overlay-button")) {
    const styles = `
      .extension-overlay-button {
        position: fixed;
        top: 0;
        left: 0;
        width:100%;
        height:100%;
        background-color: black;
        color: white;
        padding: 10px 20px;
        border: none;
        opacity:0.5;
        z-index: 9999;
      }
      `;

    const styleElement = document.createElement("style");
    if (styleElement.styleSheet) {
      styleElement.styleSheet.cssText = styles;
    } else {
      styleElement.appendChild(document.createTextNode(styles));
    }
    document.head.appendChild(styleElement);
  } else {
    document.querySelector(".extension-overlay-button").remove();
  }

  if (bool) {
    const button = document.createElement("button");
    button.classList.add("extension-overlay-button");
    button.textContent = "Click to fullScreen";
    document.body.appendChild(button);

    const extensionOverlay = document.querySelector(
      ".extension-overlay-button"
    );
    extensionOverlay.onclick = (event) => {
      document.querySelector("#my-player").requestFullscreen();
      extensionOverlay.style.display = "none";
    };
  }
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  // console.log(changes, namespace);
  storage();
});

function getRefactoredEpisodeString(websitePage) {
  if (websitePage.includes("episode-")) {
    let urlString = websitePage.split("episode-");
    urlString.push("episode-");
    return urlString;
  }
  if (websitePage.includes("film-")) {
    let urlString = websitePage.split("film-");
    urlString.push("film-");
    return urlString;
  }
  return null;
}

function getEpisodeNum(str) {
  let num = parseInt(str.replace(/[^\d]/g, ""));
  return num; // return example 20
}

function nextSeries(episodeString, intervalFunc) {
  clearInterval(intervalFunc);
  let episodeNum = getEpisodeNum(String(episodeString[1]));

  window.location.href =
    String(episodeString[0]) +
    String(episodeString[2]) +
    String(episodeNum + 1) +
    ".html";
}

function skipIntro(element, intervalFunc) {
  clearInterval(intervalFunc);
  element.click();
}

function main(configObject) {
  let page = window.location.href;
  let refactoredEpisodeString = getRefactoredEpisodeString(page);

  if (refactoredEpisodeString != null) {
    let nextSerBtn = document.querySelector(".vjs-overlay-bottom-right");
    let skipIntroBtn = document.querySelector(".vjs-overlay-bottom-left");

    let nextSeriesBeforeEndBool = configObject.nextSeriesBeforeEndBool;
    let nextSeriesAfterEndBool = configObject.nextSeriesAfterEndBool;
    let skipIntroBool = configObject.skipIntroBool;
    let clickToFullScreenBool = configObject.clickToFullScreenBool;

    createOverlayBtn(clickToFullScreenBool);

    if (skipIntroBtn) {
      if (skipIntroBool == true) {
        let checkSkipIntroBtnVisible = setInterval(function () {
          if (skipIntroBtn.classList.contains("vjs-hidden") != true) {
            skipIntro(skipIntroBtn, checkSkipIntroBtnVisible);
          }
        }, 2000);
      }
    }

    if (nextSerBtn) {
      if (nextSeriesBeforeEndBool == true) {
        let checkVideoEnded = setInterval(function () {
          if (nextSerBtn.classList.contains("vjs-hidden") != true) {
            nextSeries(refactoredEpisodeString, checkVideoEnded);
          }
        }, 3000);
      }
      if (nextSeriesAfterEndBool == true) {
        let checkVideoEnded = setInterval(function () {
          if (video.ended == true) {
            nextSeries(refactoredEpisodeString, checkVideoEnded);
          }
        }, 3000);
      }
    }
  }
}

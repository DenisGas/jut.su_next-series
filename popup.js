const nextSeriesBeforeEnd = document.getElementById("nextSeriesBeforeEnd");
const nextSeriesAfterEnd = document.getElementById("nextSeriesAfterEnd");
const skipIntro = document.getElementById("skipIntro");
const videoFromStart = document.getElementById("videoFromStart");
const clickToFullScreen = document.getElementById("clickToFullScreen");
const nextSeriesBeforeEndLabel = document.getElementById(
  "nextSeriesBeforeEndLabel"
);
const nextSeriesAfterEndLabel = document.getElementById(
  "nextSeriesAfterEndLabel"
);
const skipIntroLabel = document.getElementById("skipIntroLabel");
const clickToFullScreenLabel = document.getElementById(
  "clickToFullScreenLabel"
);
const videoFromStartLabel = document.getElementById("videoFromStartLabel");

function storage() {
  const jutsuExtensionDefaultConfig = {
    nextSeriesBeforeEndBool: true,
    nextSeriesAfterEndBool: false,
    skipIntroBool: true,
    clickToFullScreenBool: false,
    videoFromStartBool: false,
  };

  chrome.storage.local.get(["jutsuExtensionConfig"], (result) => {
    if (result.jutsuExtensionConfig == undefined) {
      chrome.storage.local.set({
        jutsuExtensionConfig: jutsuExtensionDefaultConfig,
      });
      return storage();
    }

    let nextSeriesBeforeEndBool =
      result.jutsuExtensionConfig.nextSeriesBeforeEndBool;
    let skipIntroBool = result.jutsuExtensionConfig.skipIntroBool;
    let clickToFullScreenBool =
      result.jutsuExtensionConfig.clickToFullScreenBool;
    let videoFromStartBool = result.jutsuExtensionConfig.videoFromStartBool;

    if (nextSeriesBeforeEndBool == true) {
      nextSeriesBeforeEnd.checked = true;
    } else {
      nextSeriesAfterEnd.checked = true;
    }

    if (skipIntroBool == true) {
      skipIntro.checked = true;
    } else {
      skipIntro.checked = false;
    }

    if (clickToFullScreenBool == true) {
      clickToFullScreen.checked = true;
    } else {
      clickToFullScreen.checked = false;
    }

    if (videoFromStartBool == true) {
      videoFromStart.checked = true;
    } else {
      videoFromStart.checked = false;
    }
  });
}

storage();

nextSeriesBeforeEndLabel.addEventListener("click", () => {
  chrome.storage.local.get("jutsuExtensionConfig", function (result) {
    result.jutsuExtensionConfig.nextSeriesBeforeEndBool = true;
    result.jutsuExtensionConfig.nextSeriesAfterEndBool = false;
    chrome.storage.local.set({
      jutsuExtensionConfig: result.jutsuExtensionConfig,
    });
  });
});

nextSeriesAfterEndLabel.addEventListener("click", () => {
  chrome.storage.local.get("jutsuExtensionConfig", function (result) {
    result.jutsuExtensionConfig.nextSeriesBeforeEndBool = false;
    result.jutsuExtensionConfig.nextSeriesAfterEndBool = true;
    chrome.storage.local.set({
      jutsuExtensionConfig: result.jutsuExtensionConfig,
    });
  });
});

skipIntroLabel.addEventListener("click", () => {
  if (skipIntro.checked === true) {
    chrome.storage.local.get("jutsuExtensionConfig", function (result) {
      result.jutsuExtensionConfig.skipIntroBool = true;
      chrome.storage.local.set({
        jutsuExtensionConfig: result.jutsuExtensionConfig,
      });
    });
  } else {
    chrome.storage.local.get("jutsuExtensionConfig", function (result) {
      result.jutsuExtensionConfig.skipIntroBool = false;
      chrome.storage.local.set({
        jutsuExtensionConfig: result.jutsuExtensionConfig,
      });
    });
  }
});

clickToFullScreenLabel.addEventListener("click", () => {
  if (clickToFullScreen.checked === true) {
    chrome.storage.local.get("jutsuExtensionConfig", function (result) {
      result.jutsuExtensionConfig.clickToFullScreenBool = true;
      chrome.storage.local.set({
        jutsuExtensionConfig: result.jutsuExtensionConfig,
      });
    });
  } else {
    chrome.storage.local.get("jutsuExtensionConfig", function (result) {
      result.jutsuExtensionConfig.clickToFullScreenBool = false;
      chrome.storage.local.set({
        jutsuExtensionConfig: result.jutsuExtensionConfig,
      });
    });
  }
});

videoFromStartLabel.addEventListener("click", () => {
  if (videoFromStart.checked === true) {
    chrome.storage.local.get("jutsuExtensionConfig", function (result) {
      result.jutsuExtensionConfig.videoFromStartBool = true;
      chrome.storage.local.set({
        jutsuExtensionConfig: result.jutsuExtensionConfig,
      });
    });
  } else {
    chrome.storage.local.get("jutsuExtensionConfig", function (result) {
      result.jutsuExtensionConfig.videoFromStartBool = false;
      chrome.storage.local.set({
        jutsuExtensionConfig: result.jutsuExtensionConfig,
      });
    });
  }
});

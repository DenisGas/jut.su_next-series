const nextSeriesBeforeEnd = document.getElementById("nextSeriesBeforeEnd");
const nextSeriesAfterEnd = document.getElementById("nextSeriesAfterEnd");
const skipIntro = document.getElementById("skipIntro");
const OffSwitcher = document.getElementById("OffSwitcher");
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
const OffSwitcherLabel = document.getElementById("OffSwitcherLabel");

const extentionStatus = document.getElementById("extentionStatus");

const jutsuExtensionDefaultConfig = {
  isExtensionON: true,
  nextSeriesBeforeEndBool: true,
  nextSeriesAfterEndBool: false,
  skipIntroBool: true,
  clickToFullScreenBool: false,
  videoFromStartBool: false,
};

function saveInStorage(configObject) {
  chrome.storage.local.set({
    jutsuExtensionConfig: configObject.jutsuExtensionConfig,
  });
}

extentionStatus.style.maxWidth

function defaultSettings(defConfigObject) {
  chrome.storage.local.set({
    jutsuExtensionConfig: defConfigObject,
  });
}

function onExtension() {
  extentionStatus.innerText = "Включено";
  extentionStatus.classList.add("On");
  nextSeriesAfterEnd.disabled = false;
  nextSeriesBeforeEnd.disabled = false;
  clickToFullScreen.disabled = false;
  skipIntro.disabled = false;
  videoFromStart.disabled = false;
}

function offExtension() {
  extentionStatus.innerText = "Выключено";
  extentionStatus.classList.remove("On");
  nextSeriesAfterEnd.disabled = true;
  nextSeriesBeforeEnd.disabled = true;
  clickToFullScreen.disabled = true;
  skipIntro.disabled = true;
  videoFromStart.disabled = true;
}



function storage() {
  chrome.storage.local.get(["jutsuExtensionConfig"], (result) => {
    if (result.jutsuExtensionConfig == undefined) {
      defaultSettings(jutsuExtensionDefaultConfig)
      return storage();
    }

    let nextSeriesBeforeEndBool =
      result.jutsuExtensionConfig.nextSeriesBeforeEndBool;
    let skipIntroBool = result.jutsuExtensionConfig.skipIntroBool;
    let clickToFullScreenBool =
      result.jutsuExtensionConfig.clickToFullScreenBool;
    let videoFromStartBool = result.jutsuExtensionConfig.videoFromStartBool;

    let isExtensionON = result.jutsuExtensionConfig.isExtensionON;

    if (isExtensionON === true) {
      OffSwitcher.checked = true;
      onExtension();
    } else {
      OffSwitcher.checked = false;
      offExtension();

    }

    if (nextSeriesBeforeEndBool === true) {
      nextSeriesBeforeEnd.checked = true;
    } else {
      nextSeriesAfterEnd.checked = true;
    }


    if (skipIntroBool === true) {
      skipIntro.checked = true;
    } else {
      skipIntro.checked = false;
    }

    if (clickToFullScreenBool === true) {
      clickToFullScreen.checked = true;
    } else {
      clickToFullScreen.checked = false;
    }

    if (videoFromStartBool === true) {
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
    saveInStorage(result)
  });
});

nextSeriesAfterEndLabel.addEventListener("click", () => {
  chrome.storage.local.get("jutsuExtensionConfig", function (result) {
    result.jutsuExtensionConfig.nextSeriesBeforeEndBool = false;
    result.jutsuExtensionConfig.nextSeriesAfterEndBool = true;
    saveInStorage(result)
  });
});


function swapAndSaveConfigEventListener(listenerElement, checkedElement, extensionOpt) {
  listenerElement.addEventListener("click", () => {
    chrome.storage.local.get("jutsuExtensionConfig", function (configObj) {
      if (checkedElement.checked === true) {
        configObj.jutsuExtensionConfig[extensionOpt] = true;
      } else {
        configObj.jutsuExtensionConfig[extensionOpt] = false;
      }
      saveInStorage(configObj)
    });
  });
}

function configEventListener(listenerElement, checkedElement, extensionOpt, trueFunc, falseFunc) {
  listenerElement.addEventListener("click", () => {
    chrome.storage.local.get("jutsuExtensionConfig", function (configObj) {
      if (checkedElement.checked === true) {
        configObj.jutsuExtensionConfig[extensionOpt] = true;
        trueFunc();
      } else {
        configObj.jutsuExtensionConfig[extensionOpt] = false;
        falseFunc();
      }
      saveInStorage(configObj)
    });
  });
}


swapAndSaveConfigEventListener(videoFromStartLabel, videoFromStart, "videoFromStartBool");
swapAndSaveConfigEventListener(clickToFullScreenLabel, clickToFullScreen, "clickToFullScreenBool");
swapAndSaveConfigEventListener(skipIntroLabel, skipIntro, "skipIntroBool");

configEventListener(OffSwitcherLabel, OffSwitcher, "isExtensionON", onExtension, offExtension);



// OffSwitcherLabel.addEventListener("click", () => {
//   chrome.storage.local.get("jutsuExtensionConfig", function (configObj) {
//     if (OffSwitcher.checked === true) {
//       configObj.jutsuExtensionConfig.isExtensionON = true;
//       offExtension();
//     } else {
//       configObj.jutsuExtensionConfig.isExtensionON = false;
//       onExtension();
//     }
//     saveInStorage(configObj)
//   });
// });


// // Создайте переменную для хранения текущего значения настройки.
// let enabled = localStorage.getItem("enabled") === "true";

// // Создайте функцию для проверки значения настройки.
// function isEnabled() {
//   return enabled;
// }

// // Добавьте кнопку для включения функции.
// document.querySelector(".button-enable").addEventListener("click", () => {
//   enabled = true;
//   localStorage.setItem("enabled", true);
// });

// // Добавьте переключатель для включения функции.
// document.querySelector(".switch-enable").addEventListener("change", () => {
//   enabled = document.querySelector(".switch-enable").checked;
//   localStorage.setItem("enabled", enabled ? "true" : "false");
// });
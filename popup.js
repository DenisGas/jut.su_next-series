const nextSeriesBeforeEnd = GetElByID("nextSeriesBeforeEnd");
const nextSeriesAfterEnd = GetElByID("nextSeriesAfterEnd");
const skipIntro = GetElByID("skipIntro");
const OffSwitcher = GetElByID("OffSwitcher");
const videoFromStart = GetElByID("videoFromStart");
const clickToFullScreen = GetElByID("clickToFullScreen");
const nextSeriesBeforeEndLabel = GetElByID(
  "nextSeriesBeforeEndLabel"
);
const nextSeriesAfterEndLabel = GetElByID(
  "nextSeriesAfterEndLabel"
);
const skipIntroLabel = GetElByID("skipIntroLabel");
const clickToFullScreenLabel = GetElByID(
  "clickToFullScreenLabel"
);
const videoFromStartLabel = GetElByID("videoFromStartLabel");
const OffSwitcherLabel = GetElByID("OffSwitcherLabel");
const extentionStatus = GetElByID("extentionStatus");

const jutsuExtensionDefaultConfig = {
  isExtensionON: true,
  nextSeriesBeforeEndBool: true,
  nextSeriesAfterEndBool: false,
  skipIntroBool: true,
  clickToFullScreenBool: false,
  videoFromStartBool: false,
}

function GetElByID(id) {
  return document.getElementById(id);
}

function saveInStorage(configObject) {
  chrome.storage.local.set({
    jutsuExtensionConfig: configObject.jutsuExtensionConfig,
  });
}

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

    OffSwitcher.checked = isExtensionON;
    onExtension();

    nextSeriesBeforeEnd.checked = nextSeriesBeforeEndBool;
    nextSeriesAfterEnd.checked = !nextSeriesBeforeEndBool;

    skipIntro.checked = skipIntroBool;
    clickToFullScreen.checked = clickToFullScreenBool;
    videoFromStart.checked = videoFromStartBool;

    if (!isExtensionON) {
      offExtension();
    }


  });
}

function handleConfigEvent(listenerElement, checkedElement, options, actions = []) {
  listenerElement.addEventListener("click", () => {
    chrome.storage.local.get("jutsuExtensionConfig", (configObj) => {
      const checked = checkedElement.checked;

      configObj.jutsuExtensionConfig[options[0]] = checked;

      for (let i = 1; i < options.length; i++) {
        configObj.jutsuExtensionConfig[options[i]] = !checked;
      }

      if (actions[0] !== undefined && actions[1] !== undefined) {
        actions[checked ? 0 : 1](); // Run trueFunc or falseFunc
      }
      saveInStorage(configObj);
    });
  });
}

storage();

handleConfigEvent(videoFromStartLabel, videoFromStart, ["videoFromStartBool"]);
handleConfigEvent(clickToFullScreenLabel, clickToFullScreen, ["clickToFullScreenBool"]);
handleConfigEvent(skipIntroLabel, skipIntro, ["skipIntroBool"]);
handleConfigEvent(nextSeriesBeforeEndLabel, nextSeriesBeforeEnd, ["nextSeriesBeforeEndBool", "nextSeriesAfterEndBool"]);
handleConfigEvent(nextSeriesAfterEndLabel, nextSeriesAfterEnd, ["nextSeriesAfterEndBool", "nextSeriesBeforeEndBool"]);
handleConfigEvent(OffSwitcherLabel, OffSwitcher, ["isExtensionON"], [onExtension, offExtension]);


//OLD VARIANT


// function swapAndSaveConfig2optEventListener(listenerElement, checkedElement, extensionOpt1, extensionOpt2) {
//   listenerElement.addEventListener("click", () => {
//     chrome.storage.local.get("jutsuExtensionConfig", function (configObj) {
//       if (checkedElement.checked === true) {
//         configObj.jutsuExtensionConfig[extensionOpt1] = true;
//         configObj.jutsuExtensionConfig[extensionOpt2] = false;
//       } else {
//         configObj.jutsuExtensionConfig[extensionOpt1] = false;
//         configObj.jutsuExtensionConfig[extensionOpt2] = true;
//       }
//       saveInStorage(configObj)
//     });
//   });
// }


// function swapAndSaveConfigEventListener(listenerElement, checkedElement, extensionOpt) {
//   listenerElement.addEventListener("click", () => {
//     chrome.storage.local.get("jutsuExtensionConfig", function (configObj) {
//       if (checkedElement.checked === true) {
//         configObj.jutsuExtensionConfig[extensionOpt] = true;
//       } else {
//         configObj.jutsuExtensionConfig[extensionOpt] = false;
//       }
//       saveInStorage(configObj)
//     });
//   });
// }

// function configEventListener(listenerElement, checkedElement, extensionOpt, trueFunc, falseFunc) {
//   listenerElement.addEventListener("click", () => {
//     chrome.storage.local.get("jutsuExtensionConfig", function (configObj) {
//       if (checkedElement.checked === true) {
//         configObj.jutsuExtensionConfig[extensionOpt] = true;
//         trueFunc();
//       } else {
//         configObj.jutsuExtensionConfig[extensionOpt] = false;
//         falseFunc();
//       }
//       saveInStorage(configObj)
//     });
//   });
// }


// swapAndSaveConfigEventListener(videoFromStartLabel, videoFromStart, "videoFromStartBool");
// swapAndSaveConfigEventListener(clickToFullScreenLabel, clickToFullScreen, "clickToFullScreenBool");
// swapAndSaveConfigEventListener(skipIntroLabel, skipIntro, "skipIntroBool");

// configEventListener(OffSwitcherLabel, OffSwitcher, "isExtensionON", onExtension, offExtension);

// swapAndSaveConfig2optEventListener(nextSeriesBeforeEndLabel, nextSeriesBeforeEnd, "nextSeriesBeforeEndBool", "nextSeriesAfterEndBool");

// swapAndSaveConfig2optEventListener(nextSeriesAfterEndLabel, nextSeriesAfterEnd, "nextSeriesAfterEndBool", "nextSeriesBeforeEndBool");



// nextSeriesBeforeEndLabel.addEventListener("click", () => {
//   chrome.storage.local.get("jutsuExtensionConfig", function (result) {
//     result.jutsuExtensionConfig.nextSeriesBeforeEndBool = true;
//     result.jutsuExtensionConfig.nextSeriesAfterEndBool = false;
//     saveInStorage(result)
//   });
// });

// nextSeriesAfterEndLabel.addEventListener("click", () => {
//   chrome.storage.local.get("jutsuExtensionConfig", function (result) {
//     result.jutsuExtensionConfig.nextSeriesBeforeEndBool = false;
//     result.jutsuExtensionConfig.nextSeriesAfterEndBool = true;
//     saveInStorage(result)
//   });
// });



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
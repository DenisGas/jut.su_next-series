
function createLocales() {
  return {
    extensionLabel: chrome.i18n.getMessage("extension"),
    statusEnabled: chrome.i18n.getMessage("status_enabled"),
    statusDisabled: chrome.i18n.getMessage("status_disabled"),
    nextSeriesBeforeEnd: chrome.i18n.getMessage("next_series_before_end"),
    nextSeriesAfterEnd: chrome.i18n.getMessage("next_series_after_end"),
    skipIntro: chrome.i18n.getMessage("skip_intro"),
  };
}


function update(e) {
  console.log(e)
}

const locales = createLocales();


class ToggleField {
  constructor(id, labelText) {
    this.id = id;
    this.labelText = labelText;
    this.element = this.createElem();
    this.type = "none";
  }

  getType() {
    return this.type;
  }

  getElem() {
    return this.element;
  }

  getId() {
    return this.id;
  }

  createElem() {
    return undefined;
  }

  isChecked() {
    return this.element.querySelector('input').checked;
  }

  setChecked(checked) {
    this.element.querySelector('input').checked = checked;
  }

  addToPage(parentElement) {
    this.element.addEventListener('change', () => {
      update(this)
    });
    parentElement.appendChild(this.element);
  }
}


class RadioButtonField extends ToggleField {
  constructor(id, name, labelText) {
    super(id, labelText)
    this.name = name;
    this.element = this.createElem();
    this.type = "radio";
  }

  createElem() {
    const label = document.createElement('label');
    label.id = this.id + 'Label';

    const input = document.createElement('input');
    input.className = 'radio';
    input.id = this.id;
    input.name = this.name;
    input.type = 'radio';

    label.appendChild(input);
    label.appendChild(document.createTextNode(this.labelText));

    return label;
  }

}

class CheckboxField extends ToggleField {
  constructor(id, labelText) {
    super(id, labelText)
    this.element = this.createElem();
    this.type = "checkbox";
  }
  createElem() {
    const label = document.createElement('label');
    label.id = this.id + 'Label';

    const input = document.createElement('input');
    input.className = 'checkbox';
    input.id = this.id;
    input.type = 'checkbox';

    const labelTextSpan = document.createElement('span');
    labelTextSpan.textContent = this.labelText;

    label.appendChild(input);
    label.appendChild(labelTextSpan);
    return label;
  }
}

class disabledExtensionCheckbox extends CheckboxField {
  constructor(id, labelText, statusClass, statusText) {
    super(id, labelText);
    this.statusClass = statusClass;
    this.statusText = statusText;
    this.type = "offBtn";
    this.element = this.createElem();
  }

  createElem() {
    const label = super.createElem(); // Вызываем метод createElem родительского класса CheckboxField
    console.log(label);
    const labelTextSpan2 = document.createElement('span'); // Создаем второй span
    labelTextSpan2.textContent = this.statusText; // Устанавливаем текст статуса
    labelTextSpan2.classList = this.statusClass;
    label.appendChild(labelTextSpan2); // Добавляем второй span
    return label;
  }
}




const checkboxesSection = document.querySelector('.checkboxes.first');
const checkboxesSection2 = document.querySelector('.checkboxes.second');
const radiosSection = document.querySelector('.radios');


const offSwitcher = new disabledExtensionCheckbox('OffSwitcher', locales.extensionLabel, "switcher disabled enabled", locales.statusEnabled);

const nextSeriesAfterEnd = new RadioButtonField('nextSeriesAfterEnd', 'nextSeries', locales.nextSeriesAfterEnd);
const skipIntro = new CheckboxField('skipIntro', locales.skipIntro);

// offSwitcher.addToPage(checkboxesSection);
// nextSeriesAfterEnd.addToPage(radiosSection);
// skipIntro.addToPage(checkboxesSection2);

const elements = [offSwitcher, nextSeriesAfterEnd, skipIntro];

elements.forEach(e => {
  const elementType = e.getType();
  console.log(e.getType());
  let parentElement;
  switch (elementType) {
    case "radio":
      parentElement = radiosSection;
      break;
    case "checkbox":
      parentElement = checkboxesSection2;
      break;
    case "offBtn":
      parentElement = checkboxesSection;
      break;
    default:
      break;
  }

  if (parentElement) {
    e.addToPage(parentElement);
  }

});


const jutsuExtensionDefaultConfig = {
  offSwitcher: true,
  nextSeriesBeforeEnd: true,
  nextSeriesAfterEnd: false,
  skipIntroBool: true,
  clickToFullScreenBool: false,
  videoFromStartBool: false,
}







// if (checkboxesSection && checkboxesSection2 && radiosSection) {


//   const nextSeriesBeforeEnd = new RadioButtonField('nextSeriesBeforeEnd', 'nextSeries', 'Следующая серия до титров');
//   const nextSeriesAfterEnd = new RadioButtonField('nextSeriesAfterEnd', 'nextSeries', 'Следующая серия после конца серии');
//   const skipIntro = new CheckboxField('skipIntro', 'Пропускать заставку');
//   const videoFromStart = new CheckboxField('videoFromStart', 'Видео с самого начала');
//   const clickToFullScreen = new CheckboxField('clickToFullScreen', 'One click to FullScreen(Overlay)');

//   // // Добавляем созданные поля в соответствующие секции
//   // checkboxesSection.appendChild(offSwitcher.createCheckboxField());
//   // radiosSection.appendChild(nextSeriesBeforeEnd.createRadioButtonField());
//   // radiosSection.appendChild(nextSeriesAfterEnd.createRadioButtonField());
//   // checkboxesSection2.appendChild(skipIntro.createCheckboxField());
//   // checkboxesSection2.appendChild(videoFromStart.createCheckboxField());
//   // checkboxesSection2.appendChild(clickToFullScreen.createCheckboxField());



//   // // Пример использования методов
//   // offSwitcher.setChecked(true); // Устанавливаем галочку
//   // console.log(`Состояние чекбокса ${offSwitcher.id}:`, offSwitcher.isChecked());

//   // const elements = {
//   //   offSwitcher: offSwitcher,

//   //   checkboxes: {
//   //     skipIntro: skipIntro
//   //   },
//   //   radios: {
//   //     nextSeriesBeforeEnd: nextSeriesBeforeEnd
//   //   }
//   // };

//   // // Добавление поля offSwitcher на страницу
//   // checkboxesSection.appendChild(elements.offSwitcher.createCheckboxField());



//   // // Установка значения checked для поля offSwitcher
//   // elements.offSwitcher.setChecked(true);

// } else {
//   console.error('Could not find checkboxes or radios section.');
// }








//const nextSeriesBeforeEnd = GetElByID("nextSeriesBeforeEnd");
// const nextSeriesAfterEnd = GetElByID("nextSeriesAfterEnd");
// const skipIntro = GetElByID("skipIntro");
// const OffSwitcher = GetElByID("OffSwitcher");
// const videoFromStart = GetElByID("videoFromStart");
// const clickToFullScreen = GetElByID("clickToFullScreen");
// const nextSeriesBeforeEndLabel = GetElByID(
//   "nextSeriesBeforeEndLabel"
// );
// const nextSeriesAfterEndLabel = GetElByID(
//   "nextSeriesAfterEndLabel"
// );
// const skipIntroLabel = GetElByID("skipIntroLabel");
// const clickToFullScreenLabel = GetElByID(
//   "clickToFullScreenLabel"
// );
// const videoFromStartLabel = GetElByID("videoFromStartLabel");
// const OffSwitcherLabel = GetElByID("OffSwitcherLabel");
// const extentionStatus = GetElByID("extentionStatus");



// Класс для создания полей чекбоксов




// function changeInterfaceLanguage() {
//   document.getElementById("OffSwitcherText").textContent = locales.extensionLabel + ":";

// }



// function GetElByID(id) {
//   return document.getElementById(id);
// }

// function saveInStorage(configObject) {
//   chrome.storage.local.set({
//     jutsuExtensionConfig: configObject.jutsuExtensionConfig,
//   });
// }

// function defaultSettings(defConfigObject) {
//   chrome.storage.local.set({
//     jutsuExtensionConfig: defConfigObject,
//   });
// }

// function onExtension() {
//   extentionStatus.innerText = locales.statusEnabled;
//   extentionStatus.classList.add("enabled");
//   nextSeriesAfterEnd.disabled = false;
//   nextSeriesBeforeEnd.disabled = false;
//   clickToFullScreen.disabled = false;
//   skipIntro.disabled = false;
//   videoFromStart.disabled = false;
// }

// function offExtension() {
//   extentionStatus.innerText = locales.statusDisabled;
//   extentionStatus.classList.remove("enabled");
//   nextSeriesAfterEnd.disabled = true;
//   nextSeriesBeforeEnd.disabled = true;
//   clickToFullScreen.disabled = true;
//   skipIntro.disabled = true;
//   videoFromStart.disabled = true;
// }

// function storage() {
//   chrome.storage.local.get(["jutsuExtensionConfig"], (result) => {
//     if (result.jutsuExtensionConfig == undefined) {
//       defaultSettings(jutsuExtensionDefaultConfig)
//       return storage();
//     }

//     let nextSeriesBeforeEndBool =
//       result.jutsuExtensionConfig.nextSeriesBeforeEndBool;
//     let skipIntroBool = result.jutsuExtensionConfig.skipIntroBool;
//     let clickToFullScreenBool =
//       result.jutsuExtensionConfig.clickToFullScreenBool;
//     let videoFromStartBool = result.jutsuExtensionConfig.videoFromStartBool;

//     let isExtensionON = result.jutsuExtensionConfig.isExtensionON;

//     OffSwitcher.checked = isExtensionON;
//     onExtension();

//     nextSeriesBeforeEnd.checked = nextSeriesBeforeEndBool;
//     nextSeriesAfterEnd.checked = !nextSeriesBeforeEndBool;

//     skipIntro.checked = skipIntroBool;
//     clickToFullScreen.checked = clickToFullScreenBool;
//     videoFromStart.checked = videoFromStartBool;

//     if (!isExtensionON) {
//       offExtension();
//     }


//   });
// }

// function handleConfigEvent(listenerElement, checkedElement, options, actions = []) {
//   listenerElement.addEventListener("click", () => {
//     chrome.storage.local.get("jutsuExtensionConfig", (configObj) => {
//       const checked = checkedElement.checked;

//       configObj.jutsuExtensionConfig[options[0]] = checked;

//       for (let i = 1; i < options.length; i++) {
//         configObj.jutsuExtensionConfig[options[i]] = !checked;
//       }

//       if (actions[0] !== undefined && actions[1] !== undefined) {
//         actions[checked ? 0 : 1](); // Run trueFunc or falseFunc
//       }
//       saveInStorage(configObj);
//     });
//   });
// }

// storage();

// handleConfigEvent(videoFromStartLabel, videoFromStart, ["videoFromStartBool"]);
// handleConfigEvent(clickToFullScreenLabel, clickToFullScreen, ["clickToFullScreenBool"]);
// handleConfigEvent(skipIntroLabel, skipIntro, ["skipIntroBool"]);
// handleConfigEvent(nextSeriesBeforeEndLabel, nextSeriesBeforeEnd, ["nextSeriesBeforeEndBool", "nextSeriesAfterEndBool"]);
// handleConfigEvent(nextSeriesAfterEndLabel, nextSeriesAfterEnd, ["nextSeriesAfterEndBool", "nextSeriesBeforeEndBool"]);
// handleConfigEvent(OffSwitcherLabel, OffSwitcher, ["isExtensionON"], [onExtension, offExtension]);


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
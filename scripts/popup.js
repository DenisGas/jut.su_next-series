function createLocales() {
  return {
    extensionLabel: chrome.i18n.getMessage("extension"),
    statusEnabled: chrome.i18n.getMessage("status_enabled"),
    statusDisabled: chrome.i18n.getMessage("status_disabled"),
    nextSeriesBeforeEnd: chrome.i18n.getMessage("next_series_before_end"),
    nextSeriesAfterEnd: chrome.i18n.getMessage("next_series_after_end"),
    skipIntro: chrome.i18n.getMessage("skip_intro"),
    videoFromStart: chrome.i18n.getMessage("video_from_start"),
    clickToFullScreen: chrome.i18n.getMessage("click_to_FullScreen")
  };
}

const locales = createLocales();

class ToggleField {
  constructor(id, labelText, btnType) {
    this.id = id;
    this.labelText = labelText;
    this.type = btnType;
  }

  createElem() {
    const label = document.createElement('label');
    label.id = this.id + 'Label';
    
    const input = document.createElement(this.type === 'radio' ? 'input' : 'input');
    input.className = this.type === 'radio' ? 'radio' : 'checkbox';
    input.id = this.id;
    if (this.type === 'radio') {
      input.name = this.name;
      input.type = 'radio';
    } else {
      input.type = 'checkbox';
    }

    label.appendChild(input);
    label.appendChild(document.createTextNode(this.labelText));
    
    return label;
  }

  isChecked() {
    return document.getElementById(this.id).checked;
  }

  setChecked(checked) {
    document.getElementById(this.id).checked = checked;
  }

  setDisabled(disabled) {
    document.getElementById(this.id).disabled = disabled;
  }

  addToPage(parentElement) {
    parentElement.appendChild(this.createElem());
  }
}

class DisabledExtensionCheckbox extends ToggleField {
  constructor(id, labelText, btnType, statusClass, statusEnabled, statusDisabled) {
    super(id, labelText, btnType);
    this.statusClass = statusClass;
    this.statusEnabled = statusEnabled;
    this.statusDisabled = statusDisabled;
    this.element = this.createElem();
  }

  setChecked(checked) {
    super.setChecked(checked);
    this.changeStatus(); // Добавляем вызов метода changeStatus после установки состояния
}


  getNowStatus() {
    return this.isChecked() ? this.statusEnabled : this.statusDisabled;
  }

  setStatus(statusElem, textContent, addClass) {
    statusElem.textContent = textContent;
    if (addClass && !statusElem.classList.contains("enabled")) {
      statusElem.classList.add("enabled");
    } else if (!addClass && statusElem.classList.contains("enabled")) {
      statusElem.classList.remove("enabled");
    }
  }

  changeStatus() {
    const isChecked = this.isChecked();
    const statusElem = document.getElementById(this.id + 'Status');
    const newText = isChecked ? this.statusEnabled : this.statusDisabled;
    this.setStatus(statusElem, newText, isChecked);
}

  createElem() {
    const label = super.createElem();
    const statusElem = document.createElement('span');
    statusElem.textContent = this.statusDisabled;
    statusElem.id = this.id + 'Status';
    statusElem.classList = this.statusClass;
    label.appendChild(statusElem);
    return label;
  }
}

class Extension {
  constructor(buttons, defaultSettings) {
    this.buttons = buttons;
    this.defaultSettings = defaultSettings;
    this.configObject = {};
    this.setChangeListener();
    this.setData();
  }

  setChangeListener() {
    this.buttons.forEach(button => {
      const element = document.getElementById(button.id);
      element.addEventListener('change', () => {
        this.configObject = this.getLocalData();
        this.saveInStorage(this.configObject);
        this.setData();
      });
    });
  }

  saveInStorage(configObject) {
    chrome.storage.local.set({ jutsuExtensionConfig: configObject });
  }

  getLocalData() {
    const configObject = {};

    this.buttons.forEach(button => {
      configObject[button.id] = button.isChecked();
    });

    return configObject;
  }

  setData() {
    chrome.storage.local.get("jutsuExtensionConfig", data => {
      const jutsuExtensionConfig = data["jutsuExtensionConfig"];
  
      this.buttons.forEach(button => {
        const buttonId = button.id;
        if (jutsuExtensionConfig && jutsuExtensionConfig.hasOwnProperty(buttonId)) {
          button.setChecked(jutsuExtensionConfig[buttonId]);
        } else if (this.defaultSettings.hasOwnProperty(buttonId)) {
          const defaultValue = this.defaultSettings[buttonId];
          button.setChecked(defaultValue);
        }
  
        if (buttonId !== "offSwitcher" && jutsuExtensionConfig && jutsuExtensionConfig["offSwitcher"] === false) {
          button.setDisabled(true);
        } else {
          button.setDisabled(false);
        }
      });
    });
  }
}

const checkboxesSection = document.querySelector('.checkboxes.first');
const checkboxesSection2 = document.querySelector('.checkboxes.second');
const radiosSection = document.querySelector('.radios');

const jutsuExtensionButtonsConfig = {
  offSwitcher: {
    type: 'offBtn',
    labelText: locales.extensionLabel,
    statusClass: 'switcher disabled',
    statusTextEnabled: locales.statusEnabled,
    statusTextDisabled: locales.statusDisabled,
    group: null,
    defaultSettings: true,
  },
  nextSeriesBeforeEnd: {
    type: 'radio',
    labelText: locales.nextSeriesBeforeEnd,
    group: 'seriesOptions',
    defaultSettings: true,
  },
  nextSeriesAfterEnd: {
    type: 'radio',
    labelText: locales.nextSeriesAfterEnd,
    group: 'seriesOptions',
    defaultSettings: false,
  },
  skipIntro: {
    type: 'checkbox',
    labelText: locales.skipIntro,
    group: null,
    defaultSettings: true,
  },
  videoFromStart: {
    type: 'checkbox',
    labelText: locales.videoFromStart,
    group: null,
    defaultSettings: false,
  },
  clickToFullScreen: {
    type: 'checkbox',
    labelText: locales.clickToFullScreen,
    group: null,
    defaultSettings: false,
  }
};

const jutsuExtensionDefaultConfig = {};

for (const btnId in jutsuExtensionButtonsConfig) {
  if (jutsuExtensionButtonsConfig.hasOwnProperty(btnId)) {
    jutsuExtensionDefaultConfig[btnId] = jutsuExtensionButtonsConfig[btnId].defaultSettings;
  }
}

const buttons = [];
for (const [id, config] of Object.entries(jutsuExtensionButtonsConfig)) {
  if (config.type === 'checkbox') {
    buttons.push(new ToggleField(id, config.labelText, config.type));
  } else if (config.type === 'offBtn') {
    buttons.push(new DisabledExtensionCheckbox(id, config.labelText, config.type, config.statusClass, config.statusTextEnabled, config.statusTextDisabled));
  } else if (config.type === 'radio') {
    buttons.push(new ToggleField(id, config.labelText, config.type));
  }
}

buttons.forEach(e => {
  const elementType = e.type;
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

const extension = new Extension(buttons, jutsuExtensionDefaultConfig);

extension.setData();


///OLD


// function createLocales() {
//   return {
//     extensionLabel: chrome.i18n.getMessage("extension"),
//     statusEnabled: chrome.i18n.getMessage("status_enabled"),
//     statusDisabled: chrome.i18n.getMessage("status_disabled"),
//     nextSeriesBeforeEnd: chrome.i18n.getMessage("next_series_before_end"),
//     nextSeriesAfterEnd: chrome.i18n.getMessage("next_series_after_end"),
//     skipIntro: chrome.i18n.getMessage("skip_intro"),
//     videoFromStart: chrome.i18n.getMessage("video_from_start"),
//     clickToFullScreen: chrome.i18n.getMessage("click_to_FullScreen")
//   };
// }

// const locales = createLocales();

// class ToggleField {
//   constructor(id, labelText, btnType) {
//     this.id = id;
//     this.labelText = labelText;
//     this.element = this.createElem();
//     this.type = btnType;
//   }

//   getType() {
//     return this.type;
//   }

//   getElem() {
//     return this.element;
//   }

//   getId() {
//     return this.id;
//   }

//   createElem() {
//     return undefined;
//   }

//   isChecked() {
//     return this.element.querySelector('input').checked;
//   }

//   setChecked(checked) {
//     this.element.querySelector('input').checked = checked;
//   }

//   setDisabled(disabled) {
//     this.element.querySelector('input').disabled = disabled;
//   }

//   addToPage(parentElement) {
//     parentElement.appendChild(this.element);
//   }
// }

// class RadioButtonField extends ToggleField {
//   constructor(id, name, btnType, labelText) {
//     super(id, labelText, btnType);
//     this.name = name;
//     this.element = this.createElem();
//   }

//   createElem() {
//     const label = document.createElement('label');
//     label.id = this.id + 'Label';

//     const input = document.createElement('input');
//     input.className = 'radio';
//     input.id = this.id;
//     input.name = this.name;
//     input.type = 'radio';

//     label.appendChild(input);
//     label.appendChild(document.createTextNode(this.labelText));

//     return label;
//   }
// }

// class CheckboxField extends ToggleField {
//   constructor(id, labelText, btnType) {
//     super(id, labelText, btnType);
//     this.element = this.createElem();
//   }

//   createElem() {
//     const label = document.createElement('label');
//     label.id = this.id + 'Label';

//     const input = document.createElement('input');
//     input.className = 'checkbox';
//     input.id = this.id;
//     input.type = 'checkbox';

//     const labelTextSpan = document.createElement('span');
//     labelTextSpan.textContent = this.labelText;

//     label.appendChild(input);
//     label.appendChild(labelTextSpan);
//     return label;
//   }
// }

// class DisabledExtensionCheckbox extends CheckboxField {
//   constructor(id, labelText, btnType, statusClass, statusEnabled, statusDisabled) {
//     super(id, labelText, btnType);
//     this.statusClass = statusClass;
//     this.statusEnabled = statusEnabled;
//     this.statusDisabled = statusDisabled;
//     this.statusText = this.getNowStatus();
//     this.element = this.createElem();
//   }

//   setChecked(checked) {
//     super.setChecked(checked);
//     this.changeStatus();
//   }

//   getNowStatus() {
//     const isChecked = super.isChecked();
//     if (isChecked) {
//       return this.statusEnabled;
//     }
//     return this.statusDisabled;
//   }

//   setStatusDisabled(statusElem) {
//     statusElem.textContent = this.statusDisabled;
//     if (statusElem.classList.contains("enabled")) statusElem.classList.toggle("enabled");
//   }

//   setStatusEnabled(statusElem) {
//     statusElem.textContent = this.statusEnabled;
//     if (statusElem.classList.contains("enabled") !== true) statusElem.classList.toggle("enabled");
//   }

//   changeStatus() {
//     if (this.getNowStatus() === this.statusEnabled) {
//       this.setStatusEnabled(this.getElem().querySelector(".disabled"));
//     } else {
//       this.setStatusDisabled(this.getElem().querySelector(".disabled"));
//     }
//   }

//   createElem() {
//     const label = super.createElem();
//     const labelTextSpan2 = document.createElement('span');
//     labelTextSpan2.textContent = this.statusText;
//     labelTextSpan2.classList = this.statusClass;
//     label.appendChild(labelTextSpan2);
//     return label;
//   }
// }

// const checkboxesSection = document.querySelector('.checkboxes.first');
// const checkboxesSection2 = document.querySelector('.checkboxes.second');
// const radiosSection = document.querySelector('.radios');

// const jutsuExtensionButtonsConfig = {
//   offSwitcher: {
//     type: 'offBtn',
//     labelText: locales.extensionLabel,
//     statusClass: 'switcher disabled enabled',
//     statusTextEnabled: locales.statusEnabled,
//     statusTextDisabled: locales.statusDisabled,
//     group: null,
//     defaultSettings: true,
//   },
//   nextSeriesBeforeEnd: {
//     type: 'radio',
//     labelText: locales.nextSeriesBeforeEnd,
//     group: 'seriesOptions',
//     defaultSettings: true,
//   },
//   nextSeriesAfterEnd: {
//     type: 'radio',
//     labelText: locales.nextSeriesAfterEnd,
//     group: 'seriesOptions',
//     defaultSettings: false,
//   },
//   skipIntro: {
//     type: 'checkbox',
//     labelText: locales.skipIntro,
//     group: null,
//     defaultSettings: true,
//   },
//   videoFromStart: {
//     type: 'checkbox',
//     labelText: locales.videoFromStart,
//     group: null,
//     defaultSettings: false,
//   },
//   clickToFullScreen: {
//     type: 'checkbox',
//     labelText: locales.clickToFullScreen,
//     group: null,
//     defaultSettings: false,
//   }
// };

// const jutsuExtensionDefaultConfig = {};

// for (const btnId in jutsuExtensionButtonsConfig) {
//   if (jutsuExtensionButtonsConfig.hasOwnProperty(btnId)) {
//     jutsuExtensionDefaultConfig[btnId] = jutsuExtensionButtonsConfig[btnId].defaultSettings;
//   }
// }

// const buttons = [];
// for (const [id, config] of Object.entries(jutsuExtensionButtonsConfig)) {
//   if (config.type === 'checkbox') {
//     buttons.push(new CheckboxField(id, config.labelText, config.type));
//   } else if (config.type === 'offBtn') {
//     buttons.push(new DisabledExtensionCheckbox(id, config.labelText, config.type, config.statusClass, config.statusTextEnabled, config.statusTextDisabled));
//   } else if (config.type === 'radio') {
//     buttons.push(new RadioButtonField(id, config.group, config.type, config.labelText));
//   }
// }

// buttons.forEach(e => {
//   const elementType = e.getType();
//   let parentElement;
//   switch (elementType) {
//     case "radio":
//       parentElement = radiosSection;
//       break;
//     case "checkbox":
//       parentElement = checkboxesSection2;
//       break;
//     case "offBtn":
//       parentElement = checkboxesSection;
//       break;
//     default:
//       break;
//   }

//   if (parentElement) {
//     e.addToPage(parentElement);
//   }

// });


// class Extension {
//   constructor(buttons, defaultSettings) {
//     this.buttons = buttons;
//     this.defaultSettings = defaultSettings;
//     this.configObject = this.getLocalData();
//     this.setChangeListener();
//     this.setData();
//   }

//   setChangeListener() {
//     this.buttons.forEach(button => {
//       button.getElem().addEventListener('change', () => {
//         this.configObject = this.getLocalData();
//         this.saveInStorage(this.configObject);
//         this.setData();
//       });
//     });
//   }

//   saveInStorage(configObject) {
//     chrome.storage.local.set({
//       jutsuExtensionConfig: configObject,
//     });
//   }

//   getLocalData() {
//     const configObject = {};

//     this.buttons.forEach(button => {
//       configObject[button.getId()] = button.isChecked();
//     });

//     return configObject;
//   }

//   setData() {
//     chrome.storage.local.get("jutsuExtensionConfig", data => {
//       const jutsuExtensionConfig = data["jutsuExtensionConfig"];
  
//       this.buttons.forEach(button => {
//         const buttonId = button.getId();
//         if (jutsuExtensionConfig && jutsuExtensionConfig.hasOwnProperty(buttonId)) {
//           button.setChecked(jutsuExtensionConfig[buttonId]);
//         } else if (this.defaultSettings.hasOwnProperty(buttonId)) {
//           const defaultValue = this.defaultSettings[buttonId];
//           button.setChecked(defaultValue);
//         }
  
//         if (buttonId !== "offSwitcher" && jutsuExtensionConfig && jutsuExtensionConfig["offSwitcher"] === false) {
//           button.setDisabled(true);
//         } else {
//           button.setDisabled(false);
//         }
//       });
//     });
//   }
// }

// const extension = new Extension(buttons, jutsuExtensionDefaultConfig);

// extension.setData();

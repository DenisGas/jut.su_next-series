function createLocales() {
  return {
    extensionLabel: chrome.i18n.getMessage("extension"),
    statusEnabled: chrome.i18n.getMessage("status_enabled"),
    statusDisabled: chrome.i18n.getMessage("status_disabled"),
    nextSeriesBeforeEnd: chrome.i18n.getMessage("next_series_before_end"),
    nextSeriesAfterEnd: chrome.i18n.getMessage("next_series_after_end"),
    skipIntro: chrome.i18n.getMessage("skip_intro"),
    videoFromStart: chrome.i18n.getMessage("video_from_start"),
    clickToFullScreen: chrome.i18n.getMessage("click_to_FullScreen"),
    markVideoTimeLine: chrome.i18n.getMessage("mark_video_timeline"),
    addSpeedControl: chrome.i18n.getMessage("add_speed_control")
  };
}

document.querySelectorAll('[data-locale]').forEach(element => {
  const key = element.getAttribute('data-locale');
  element.textContent = chrome.i18n.getMessage(key);
});

const toggleBtn = document.getElementById('toggle-settings');
const mainSection = document.getElementById('main-section');
const extensionToggleSection = document.getElementById('extension-toggle-section');
const additionalSection = document.getElementById('additional-section');

mainSection.style.display = 'block';
extensionToggleSection.style.display = "block";
additionalSection.style.display = 'none';
toggleBtn.textContent = chrome.i18n.getMessage('showAdditional');

toggleBtn.addEventListener('click', function () {
  if (mainSection.style.display === 'none' || extensionToggleSection.style.display === "none") {
    mainSection.style.display = 'block';
    // extensionToggleSection.style.display = "block"; 
    additionalSection.style.display = 'none';
    toggleBtn.textContent = chrome.i18n.getMessage('showAdditional');
  } else {
    mainSection.style.display = 'none';
    // extensionToggleSection.style.display = "none"; 
    additionalSection.style.display = 'block';
    toggleBtn.textContent = chrome.i18n.getMessage('showMain');
  }
});


const locales = createLocales();

class ToggleField {
  constructor(id, labelText, btnType, section, name = null) {
    this.id = id;
    this.labelText = labelText;
    this.type = btnType;
    this.section = section;
    this.name = name;
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
  constructor(id, labelText, btnType, section, statusClass, statusEnabled, statusDisabled) {
    super(id, labelText, btnType, section);
    this.statusClass = statusClass;
    this.statusEnabled = statusEnabled;
    this.statusDisabled = statusDisabled;
    this.element = this.createElem();
  }

  setChecked(checked) {
    super.setChecked(checked);
    this.changeStatus(); // Add a call to the changeStatus method after setting the state
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
        this.saveInStorage(this.configObject)
          .then(() => {
            this.setData();
          })
          .catch(error => {
            console.error('Error saving data:', error);
          });
      });
    });
  }


  async saveInStorage(configObject) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ jutsuExtensionConfig: configObject }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  getLocalData() {
    const configObject = {};

    this.buttons.forEach(button => {
      configObject[button.id] = button.isChecked();
    });

    return configObject;
  }

  setData() {
    chrome.storage.sync.get("jutsuExtensionConfig", data => {
      const jutsuExtensionConfig = data["jutsuExtensionConfig"];

      this.buttons.forEach(button => {
        const buttonId = button.id;
        if (jutsuExtensionConfig && jutsuExtensionConfig.hasOwnProperty(buttonId)) {
          button.setChecked(jutsuExtensionConfig[buttonId]);
        } else if (this.defaultSettings.hasOwnProperty(buttonId)) {
          const defaultValue = this.defaultSettings[buttonId];
          button.setChecked(defaultValue);
        }

        if (buttonId !== "extensionEnabled" && jutsuExtensionConfig && jutsuExtensionConfig["extensionEnabled"] === false) {
          button.setDisabled(true);
        } else {
          button.setDisabled(false);
        }
      });
    });
  }
}


const jutsuExtensionButtonsConfig = {
  extensionEnabled: {
    type: 'extensionSwitch',
    labelText: locales.extensionLabel + ": ",
    statusClass: 'switcher disabled',
    statusTextEnabled: locales.statusEnabled,
    statusTextDisabled: locales.statusDisabled,
    group: null,
    defaultSettings: true,
    section: 'main'
  },
  nextSeriesBeforeEnd: {
    type: 'radio',
    labelText: locales.nextSeriesBeforeEnd,
    group: 'seriesOptions',
    defaultSettings: true,
    section: 'main'
  },
  nextSeriesAfterEnd: {
    type: 'radio',
    labelText: locales.nextSeriesAfterEnd,
    group: 'seriesOptions',
    defaultSettings: false,
    section: 'main'
  },
  skipIntro: {
    type: 'checkbox',
    labelText: locales.skipIntro,
    group: null,
    defaultSettings: true,
    section: 'main'
  },
  videoFromStart: {
    type: 'checkbox',
    labelText: locales.videoFromStart,
    group: null,
    defaultSettings: false,
    section: 'main'
  },
  clickToFullScreen: {
    type: 'checkbox',
    labelText: locales.clickToFullScreen,
    group: null,
    defaultSettings: false,
    section: 'additional'
  },
  addSpeedControl: {
    type: 'checkbox',
    labelText: locales.addSpeedControl,
    group: null,
    defaultSettings: false,
    section: 'additional'
  },
  markVideoTimeLine: {
    type: 'checkbox',
    labelText: locales.markVideoTimeLine,
    group: null,
    defaultSettings: true,
    section: 'additional'
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
    buttons.push(new ToggleField(id, config.labelText, config.type, config.section));
  } else if (config.type === 'extensionSwitch') {
    buttons.push(new DisabledExtensionCheckbox(id, config.labelText, config.type, config.section, config.statusClass, config.statusTextEnabled, config.statusTextDisabled));
  } else if (config.type === 'radio') {
    buttons.push(new ToggleField(id, config.labelText, config.type, config.section, config.group));
  }
}

buttons.forEach(e => {
  let parentElement;
  if (e.type === 'radio') {
    parentElement = e.section === 'main' ? document.querySelector('#main-section .radios') : document.querySelector('#additional-section .radios');
  } else if (e.type === 'checkbox') {
    parentElement = e.section === 'main' ? document.querySelector('#main-section .checkboxes') : document.querySelector('#additional-section .checkboxes');
  } else if (e.type === 'extensionSwitch') {
    parentElement = document.querySelector('#extension-toggle-section');
  }

  if (parentElement) {
    e.addToPage(parentElement);
  }
});


const extension = new Extension(buttons, jutsuExtensionDefaultConfig);

extension.setData();

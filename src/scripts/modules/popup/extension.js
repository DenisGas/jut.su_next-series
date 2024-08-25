// extension.js
export class Extension {
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
  
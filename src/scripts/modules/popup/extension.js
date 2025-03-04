import storage from '../common/storage';

export default class Extension {
  constructor(buttons, defaultSettings) {
    this.buttons = buttons;
    this.defaultSettings = defaultSettings;
    this.configObject = {};
    this.setChangeListener();
    this.setData();
    this.listenForStorageChanges();
  }

  listenForStorageChanges() {
    storage.onChanged((changes, areaName) => {
      if (areaName === 'local' && changes.jutsuExtensionConfig) {
        this.setData();
      }
    });
  }

  setChangeListener() {
    this.buttons.forEach((button) => {
      const element = document.getElementById(button.id);
      element.addEventListener('change', async () => {
        this.configObject = this.getLocalData();
        await this.saveInStorage(this.configObject);
      });
    });
  }

  async saveInStorage(configObject) {
    try {
      await storage.setLocalItem('jutsuExtensionConfig', configObject);
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  }

  getLocalData() {
    const configObject = {};
    this.buttons.forEach((button) => {
      configObject[button.id] = button.isChecked();
    });
    return configObject;
  }

  async setData() {
    try {
      const jutsuExtensionConfig = await storage.getLocalItem(
        'jutsuExtensionConfig'
      );

      this.buttons.forEach((button) => {
        const buttonId = button.id;
        if (
          jutsuExtensionConfig &&
          Object.prototype.hasOwnProperty.call(jutsuExtensionConfig, buttonId)
        ) {
          button.setChecked(jutsuExtensionConfig[buttonId]);
        } else if (
          Object.prototype.hasOwnProperty.call(this.defaultSettings, buttonId)
        ) {
          const defaultValue = this.defaultSettings[buttonId];
          button.setChecked(defaultValue);
        }

        if (
          buttonId !== 'extensionEnabled' &&
          jutsuExtensionConfig &&
          jutsuExtensionConfig.extensionEnabled === false
        ) {
          button.setDisabled(true);
        } else {
          button.setDisabled(false);
        }
      });
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  }
}

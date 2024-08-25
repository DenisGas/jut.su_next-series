// ConfigManager.js
export class ConfigManager {
    static async loadConfig(defaultConfig) {
      return new Promise((resolve) => {
        chrome.storage.sync.get("jutsuExtensionConfig", (result) => {
          if (result.jutsuExtensionConfig === undefined) {
            chrome.storage.sync.set(
              { jutsuExtensionConfig: defaultConfig },
              () => {
                resolve(defaultConfig);
              }
            );
          } else {
            resolve(result.jutsuExtensionConfig);
          }
        });
      });
    }
  }
  
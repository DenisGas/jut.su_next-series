// ConfigManager.js
import storage from '../../common/storage';

class ConfigManager {
  /**
   * Loads the configuration from sync storage. If no configuration is found,
   * saves and returns the provided default configuration.
   * @param {object} defaultConfig - The default configuration to use if none is stored.
   * @returns {Promise<object>} The loaded configuration object.
   */
  static async loadConfig(defaultConfig) {
    const config = await storage.getLocalItem('jutsuExtensionConfig');

    // If configuration is not found, set it to the default configuration
    if (config === null) {
      await storage.setLocalItem('jutsuExtensionConfig', defaultConfig);
      return defaultConfig;
    }

    return config;
  }
}

export default ConfigManager;

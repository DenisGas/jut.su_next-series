import Browser from 'webextension-polyfill';

const storage = {
  /**
   * Retrieves an item from the `sync` storage.
   * @param {string} key - The key for the item to retrieve.
   * @returns {Promise<any | null>} The value associated with the key, or `null` if not found.
   */
  async getItem(key) {
    try {
      const result = await Browser.storage.sync.get(key);
      return key in result ? result[key] : null;
    } catch (error) {
      console.error(
        `Error retrieving item with key "${key}" from sync storage:`,
        error
      );
      return null;
    }
  },

  /**
   * Saves an item to the `sync` storage.
   * @param {string} key - The key for the item to save.
   * @param {any} value - The value to save associated with the key.
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    try {
      const data = {};
      data[key] = value;
      await Browser.storage.sync.set(data);
      // console.log(`Item with key "${key}" saved in sync storage:`, value);
    } catch (error) {
      console.error(
        `Error saving item with key "${key}" in sync storage:`,
        error
      );
    }
  },

  /**
   * Removes an item from the `sync` storage.
   * @param {string} key - The key for the item to remove.
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    try {
      await Browser.storage.sync.remove(key);
      // console.log(`Item with key "${key}" removed from sync storage.`);
    } catch (error) {
      console.error(
        `Error removing item with key "${key}" from sync storage:`,
        error
      );
    }
  },

  /**
   * Retrieves an item from the `local` storage.
   * @param {string} key - The key for the item to retrieve.
   * @returns {Promise<any | null>} The value associated with the key, or `null` if not found.
   */
  async getLocalItem(key) {
    try {
      const result = await Browser.storage.local.get(key);
      // console.log(`Loading from local storage: ${key} =`, result[key]);
      return key in result ? result[key] : null;
    } catch (error) {
      console.error(`Error retrieving ${key} from local storage:`, error);
      return null;
    }
  },

  /**
   * Saves an item to the `local` storage.
   * @param {string} key - The key for the item to save.
   * @param {any} value - The value to save associated with the key.
   * @returns {Promise<void>}
   */
  async setLocalItem(key, value) {
    try {
      const data = {};
      data[key] = value;
      await Browser.storage.local.set(data);
      // console.log(`Item with key "${key}" saved in local storage:`, value);
    } catch (error) {
      console.error(
        `Error saving item with key "${key}" in local storage:`,
        error
      );
    }
  },

  /**
   * Removes an item from the `local` storage.
   * @param {string} key - The key for the item to remove.
   * @returns {Promise<void>}
   */
  async removeLocalItem(key) {
    try {
      await Browser.storage.local.remove(key);
      // console.log(`Item with key "${key}" removed from local storage.`);
    } catch (error) {
      console.error(
        `Error removing item with key "${key}" from local storage:`,
        error
      );
    }
  },

  /**
   * Sets up a listener for changes in both `sync` and `local` storage areas.
   * @param {function} callback - Function to execute on storage changes. Receives two parameters:
   *                              `changes` - An object listing changed items.
   *                              `areaName` - The name of the storage area ("sync" or "local").
   */
  onChangedArea(callback) {
    Browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync' || areaName === 'local') {
        callback(changes, areaName);
      }
    });
  },

  /**
   * Sets up a listener for changes in `storage`.
   * @param {function} callback - Function to execute on storage changes.
   *                              Receives `changes` (an object listing changed items)
   *                              and `areaName` (storage area: "sync" or "local").
   */
  onChanged(callback) {
    Browser.storage.onChanged.addListener(callback);
  },
};

export default storage;

// EventManager.js
export class EventManager {
    static addWindowLoadListener(callback) {
      window.addEventListener("load", callback);
    }
  
    static addStorageChangeListener(callback) {
      chrome.storage.onChanged.addListener(callback);
    }
  }
  
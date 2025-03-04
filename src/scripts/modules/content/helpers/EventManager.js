import storage from '../../common/storage';

class EventManager {
  static addWindowLoadListener(callback) {
    window.addEventListener('load', callback);
  }

  static addStorageChangeListener(callback) {
    storage.onChanged(callback);
  }
}

export default EventManager;

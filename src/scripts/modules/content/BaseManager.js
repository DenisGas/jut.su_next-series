// BaseManager.js

class BaseManager {
  update() {
    throw new Error('Method "update" must be implemented in a subclass');
  }

  disable() {
    throw new Error('Method "disable" must be implemented in a subclass');
  }
}

export default BaseManager;

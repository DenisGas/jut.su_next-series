class ShortCutsManager {
    #shortcuts = {};
    #eventListener;
  
    constructor() {
      this.#initializeEventListeners();
    }
  
    registerShortcut(key, callback, excludeSelectors = ["#message", 'input[type="text"][name="ystext"]']) {
      this.#shortcuts[key] = { callback, excludeSelectors };
    }
  
    #initializeEventListeners() {
      this.#eventListener = (event) => {
        const key = event.code;
        // console.log(`Key pressed: ${key}`); // Debug log
        if (this.#shortcuts[key]) {
          const { callback, excludeSelectors } = this.#shortcuts[key];
          if (!excludeSelectors.some(selector => document.activeElement === document.querySelector(selector))) {
            // console.log(`Executing callback for key: ${key}`); // Debug log
            callback(event);
          }
        }
      };
      document.addEventListener("keydown", this.#eventListener);
    }
  
    removeShortcut(key) {
      delete this.#shortcuts[key];
    }
  
    clearAllShortcuts() {
      this.#shortcuts = {};
    }
  
    disable() {
      document.removeEventListener("keydown", this.#eventListener);
    }
  
    // update(newShortcuts) {
    //   this.disable();
    //   this.#shortcuts = newShortcuts;
    //   this.#initializeEventListeners();
    // }

    update(){
        this.disable();
        this.#initializeEventListeners();
    }
  }
  
  export default ShortCutsManager;
  
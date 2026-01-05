import { jutsuExtensionDefaultConfig } from './modules/common/сonfig';
import NextSeriesManager from './modules/content/NextSeriesManager';
import MarkVideoTimeLineManager from './modules/content/MarkVideoTimeLineManager';
import SkipIntroManager from './modules/content/SkipIntroManager';
import EventManager from './modules/content/helpers/EventManager';
import ConfigManager from './modules/content/helpers/ConfigManager';
import VideoManager from './modules/content/helpers/VideoManager';
import PseudoFullscreenManager from './modules/content/PseudoFullscreenManager';
import { defaultShortcuts } from './modules/content/helpers/shortcuts';
import ShortCutsManager from './modules/content/ShortCutsManager';
import VideoSpeedManager from './modules/content/VideoSpeedManager';
import ClickToFullScreenManager from './modules/content/ClickToFullScreenManager';

class JutsuExtension {
  #config = {};

  #skipIntervalId = null;

  #nextIntervalId = null;

  #videoElement = null;

  #videoData = {};

  #NextSeriesManager;

  #MarkVideoTimeLineManager;

  #SkipIntroManager;

  #PseudoFullscreenManager;

  #allManager = [];

  #shortCutsManager;

  #VideoSpeedManager;

  #ClickToFullScreenManager;

  constructor() {
    this.init();
  }

  async init() {
    if (this.#workOnThisPage(window.location.href)) {
      this.#config = await ConfigManager.loadConfig(
        jutsuExtensionDefaultConfig
      );
      this.#videoElement = await VideoManager.findVideoElement();
      if (this.#videoElement) {
        this.#videoData = new VideoManager(
          this.#videoElement
        ).extractVideoData();

        this.#NextSeriesManager = new NextSeriesManager(this.#videoElement);
        this.#MarkVideoTimeLineManager = new MarkVideoTimeLineManager(
          this.#videoElement,
          this.#videoData
        );
        this.#SkipIntroManager = new SkipIntroManager(
          this.#videoElement,
          this.#videoData
        );
        this.#shortCutsManager = new ShortCutsManager();
        this.#PseudoFullscreenManager = new PseudoFullscreenManager(
          this.#videoElement
        );
        this.#VideoSpeedManager = new VideoSpeedManager(this.#videoElement);
        this.#ClickToFullScreenManager = new ClickToFullScreenManager(
          this.#videoElement
        );
        this.#allManager = [
          this.#NextSeriesManager,
          this.#SkipIntroManager,
          this.#MarkVideoTimeLineManager,
          this.#shortCutsManager,
          this.#PseudoFullscreenManager,
          this.#VideoSpeedManager,
          this.#ClickToFullScreenManager,
        ];

        if (this.#config.extensionEnabled) {
          this.#enableExtension();
          this.#videoElement.play();
          this.#videoElement.focus();
          if (this.#config.videoFromStart) {
            this.#videoFromStart();
          }
        } else {
          this.#disableExtension();
        }
      }

      EventManager.addStorageChangeListener(async (changes) => {
        console.log('Storage changed:', changes);
        if (changes.jutsuExtensionConfig) {
          this.#config = await ConfigManager.loadConfig(
            jutsuExtensionDefaultConfig
          );
          if (this.#config.extensionEnabled) {
            this.#enableExtension();
          } else {
            this.#disableExtension();
          }
        }
      });
    }

    // EventManager.addWindowLoadListener(async () => {

    // });
  }

  #initializeShortcuts() {
    const shortcuts = defaultShortcuts;

    for (let i = 0; i <= 9; i += 1) {
      this.#shortCutsManager.registerShortcut(`Digit${i}`, () => {
        const jumpTime = (i / 9) * this.#videoElement.duration;
        this.#videoElement.currentTime = jumpTime;
      });
    }

    this.#shortCutsManager.registerShortcut(shortcuts.pause, () => {
      if (this.#videoElement.paused) {
        this.#videoElement.play();
      } else {
        this.#videoElement.pause();
      }
    });

    this.#shortCutsManager.registerShortcut(
      shortcuts.actionPseudoFullScreen,
      () => {
        if (this.#config.pseudoFullscreen) {
          this.#PseudoFullscreenManager.toggle();
        }
      }
    );

    this.#shortCutsManager.registerShortcut(shortcuts.mute, () => {
      const muteControl = document.querySelector('.vjs-mute-control');
      if (muteControl) {
        muteControl.click();
        this.#videoElement.focus();
      } else {
        console.warn('mute control button not found.');
      }
    });

    this.#shortCutsManager.registerShortcut(shortcuts.actionFullScreen, () => {
      const fullScreenControl = document.querySelector(
        '.vjs-fullscreen-control'
      );
      if (fullScreenControl) {
        fullScreenControl.click();
        this.#videoElement.focus();
      } else {
        console.warn('Full screen control button not found.');
      }
    });
  }

  #videoFromStart() {
    const checkVideoTimeNotZero = setInterval(() => {
      if (this.#videoElement.currentTime > 0) {
        this.#videoElement.currentTime = 0.2;
        clearInterval(checkVideoTimeNotZero);
      }
    }, 200);
  }

  #disableExtension() {
    this.#allManager.forEach((m) => {
      m.disable();
    });
    this.#clearIntervals();
  }

  #updateManager() {
    this.#allManager.forEach((m) => {
      m.update();
    });
  }

  #clearIntervals() {
    if (this.#skipIntervalId) {
      clearInterval(this.#skipIntervalId);
      this.#skipIntervalId = null;
    }
    if (this.#nextIntervalId) {
      clearInterval(this.#nextIntervalId);
      this.#nextIntervalId = null;
    }
  }

  #workOnThisPage(websitePage) {
    return websitePage.includes('episode-') || websitePage.includes('film-');
  }

  #enableExtension() {
    this.#updateManager();
    this.#clearIntervals();
    this.#initializeShortcuts();

    // Skip intro
    if (this.#config.skipIntro) {
      this.#skipIntervalId = setInterval(() => {
        const skipIntroBtn = document.querySelector('.vjs-overlay-bottom-left');
        if (skipIntroBtn) {
          console.log("Кнопка 'Skip Intro' знайдена");
          this.#SkipIntroManager.skipIntro(
            skipIntroBtn,
            this.#config.skipIntroFix
          );
          clearInterval(this.#skipIntervalId);
          this.#skipIntervalId = null;
        }
      }, 500);
    }

    // Next series
    if (this.#config.nextSeriesBeforeEnd || this.#config.nextSeriesAfterEnd) {
      this.#nextIntervalId = setInterval(() => {
        const nextSerBtn = document.querySelector('.vjs-overlay-bottom-right');
        if (nextSerBtn) {
          console.log("Кнопка 'Next Series' знайдена");
          if (this.#config.nextSeriesBeforeEnd) {
            this.#NextSeriesManager.nextSeriesBeforeEnd(nextSerBtn);
          } else if (this.#config.nextSeriesAfterEnd) {
            this.#NextSeriesManager.nextSeriesAfterEnd(nextSerBtn);
          }
          clearInterval(this.#nextIntervalId);
          this.#nextIntervalId = null;
        }
      }, 500);
    }

    if (this.#config.markVideoTimeLine) {
      this.#MarkVideoTimeLineManager.markVideoTimeLine();
    }

    if (this.#config.addSpeedControl) {
      this.#VideoSpeedManager.start();
    } else {
      this.#VideoSpeedManager.disable();
    }

    if (this.#config.pseudoFullscreen) {
      this.#PseudoFullscreenManager.start();
    } else {
      this.#PseudoFullscreenManager.disable();
    }

    if (this.#config.clickToFullScreen) {
      this.#ClickToFullScreenManager.start();
    } else {
      this.#ClickToFullScreenManager.disable();
    }
  }
}

// eslint-disable-next-line no-unused-vars
const jutsuExtension = new JutsuExtension();

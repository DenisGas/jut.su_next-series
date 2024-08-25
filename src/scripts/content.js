import { jutsuExtensionDefaultConfig } from "./modules/common/Config";
import NextSeriesManager from "./modules/content/NextSeriesManager";
import MarkVideoTimeLineManager from "./modules/content/MarkVideoTimeLineManager";
import SkipIntroManager from "./modules/content/SkipIntroManager";
import EventManager from "./modules/content/EventManager";
import ConfigManager from "./modules/content/ConfigManager";
import VideoManager from "./modules/content/VideoManager";
// import PseudoFullscreenManager from "./modules/content/PseudoFullscreenManager";

class JutsuExtension {
  #config = {};
  #videoElement = null;
  #videoData = {};
  #NextSeriesManager;
  #MarkVideoTimeLineManager;
  #SkipIntroManager;
  // #PseudoFullscreenManager;
  #allManager = [];

  constructor() {
    this.init();
  }

  async init() {
    EventManager.addWindowLoadListener(async () => {
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
          // this.#PseudoFullscreenManager = new PseudoFullscreenManager(
          //   this.#videoElement,
          //   this.#config
          // );
          this.#allManager = [
            this.#NextSeriesManager,
            this.#SkipIntroManager,
            this.#MarkVideoTimeLineManager,
            // this.#PseudoFullscreenManager,
          ];

          if (this.#config.extensionEnabled) {
            this.#enableExtension();
            this.#videoElement.play();
            if (this.#config.videoFromStart) {
              this.#videoFromStart();
            }
          } else {
            this.#disableExtension();
          }
        }

        EventManager.addStorageChangeListener(async (changes) => {
          this.#config = await ConfigManager.loadConfig(
            jutsuExtensionDefaultConfig
          );
          if (this.#config.extensionEnabled === true) {
            this.#enableExtension();
          } else {
            this.#disableExtension();
          }
        });
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
  }

  #workOnThisPage(websitePage) {
    return websitePage.includes("episode-") || websitePage.includes("film-");
  }

  #enableExtension() {
    this.#disableExtension();

    const nextSerBtn = document.querySelector(".vjs-overlay-bottom-right");
    const skipIntroBtn = document.querySelector(".vjs-overlay-bottom-left");

    if (nextSerBtn) {
      if (this.#config.nextSeriesBeforeEnd) {
        this.#NextSeriesManager.nextSeriesBeforeEnd(nextSerBtn);
      } else if (this.#config.nextSeriesAfterEnd) {
        this.#NextSeriesManager.nextSeriesAfterEnd(nextSerBtn);
      }
    }

    if (skipIntroBtn && this.#config.skipIntro) {
      this.#SkipIntroManager.skipIntro(skipIntroBtn);
    }

    if (this.#config.markVideoTimeLine) {
      this.#MarkVideoTimeLineManager.markVideoTimeLine();
    }

    // if (this.#config.pseudoFullscreen) {
    //   this.#PseudoFullscreenManager.updatePseudoFullscreen();
    // }
  }
}

const jutsuExtension = new JutsuExtension();

// Config.js

const locales = {
  extensionLabel: chrome.i18n.getMessage("extension"),
  statusEnabled: chrome.i18n.getMessage("status_enabled"),
  statusDisabled: chrome.i18n.getMessage("status_disabled"),
  nextSeriesBeforeEnd: chrome.i18n.getMessage("next_series_before_end"),
  nextSeriesAfterEnd: chrome.i18n.getMessage("next_series_after_end"),
  skipIntro: chrome.i18n.getMessage("skip_intro"),
  videoFromStart: chrome.i18n.getMessage("video_from_start"),
  clickToFullScreen: chrome.i18n.getMessage("click_to_FullScreen"),
  markVideoTimeLine: chrome.i18n.getMessage("mark_video_timeline"),
  addSpeedControl: chrome.i18n.getMessage("add_speed_control"),
  pseudoFullscreen: chrome.i18n.getMessage("pseudo_Fullscreen"),
};


export const jutsuExtensionButtonsConfig = {
  extensionEnabled: {
    type: 'extensionSwitch',
    labelText: locales.extensionLabel + ": ",
    statusClass: 'switcher disabled',
    statusTextEnabled: locales.statusEnabled,
    statusTextDisabled: locales.statusDisabled,
    group: null,
    defaultSettings: true,
    section: 'main'
  },
  nextSeriesBeforeEnd: {
    type: 'radio',
    labelText: locales.nextSeriesBeforeEnd,
    group: 'seriesOptions',
    defaultSettings: true,
    section: 'main'
  },
  nextSeriesAfterEnd: {
    type: 'radio',
    labelText: locales.nextSeriesAfterEnd,
    group: 'seriesOptions',
    defaultSettings: false,
    section: 'main'
  },
  skipIntro: {
    type: 'checkbox',
    labelText: locales.skipIntro,
    group: null,
    defaultSettings: true,
    section: 'main'
  },
  videoFromStart: {
    type: 'checkbox',
    labelText: locales.videoFromStart,
    group: null,
    defaultSettings: false,
    section: 'additional'
  },
  pseudoFullscreen: {
    type: 'checkbox',
    labelText: locales.pseudoFullscreen,
    group: null,
    defaultSettings: false,
    section: 'main'
  },

  // clickToFullScreen: {
  //   type: 'checkbox',
  //   labelText: locales.clickToFullScreen,
  //   group: null,
  //   defaultSettings: false,
  //   section: 'additional'
  // },

  // addSpeedControl: {
  //   type: 'checkbox',
  //   labelText: locales.addSpeedControl,
  //   group: null,
  //   defaultSettings: false,
  //   section: 'additional'
  // },

  markVideoTimeLine: {
    type: 'checkbox',
    labelText: locales.markVideoTimeLine,
    group: null,
    defaultSettings: true,
    section: 'additional'
  }
};

export const jutsuExtensionDefaultConfig = Object.fromEntries(
  Object.entries(jutsuExtensionButtonsConfig).map(([id, config]) => [id, config.defaultSettings])
);

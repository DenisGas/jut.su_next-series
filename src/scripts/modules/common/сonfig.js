import { getLocales, localizationKeys } from './locales';

const locales = getLocales();

export const jutsuExtensionButtonsConfig = {
  extensionEnabled: {
    type: 'extensionSwitch',
    labelText: `${locales[localizationKeys.extension]}: `,
    description: locales[localizationKeys.extension_description], // Исправлено
    statusClass: 'switcher disabled',
    statusTextEnabled: locales[localizationKeys.status_enabled],
    statusTextDisabled: locales[localizationKeys.status_disabled],
    group: null,
    defaultSettings: true,
    section: 'main',
  },
  nextSeriesBeforeEnd: {
    type: 'radio',
    labelText: locales[localizationKeys.next_series_before_end],
    description: locales[localizationKeys.next_series_before_end_description], // Исправлено
    group: 'seriesOptions',
    defaultSettings: true,
    section: 'main',
  },
  nextSeriesAfterEnd: {
    type: 'radio',
    labelText: locales[localizationKeys.next_series_after_end],
    description: locales[localizationKeys.next_series_after_end_description], // Исправлено
    group: 'seriesOptions',
    defaultSettings: false,
    section: 'main',
  },
  skipIntro: {
    type: 'checkbox',
    labelText: locales[localizationKeys.skip_intro],
    description: locales[localizationKeys.skip_intro_description], // Исправлено
    group: null,
    defaultSettings: true,
    section: 'main',
  },
  videoFromStart: {
    type: 'checkbox',
    labelText: locales[localizationKeys.video_from_start],
    description: locales[localizationKeys.video_from_start_description], // Исправлено
    group: null,
    defaultSettings: false,
    section: 'additional',
  },
  pseudoFullscreen: {
    type: 'checkbox',
    labelText: locales[localizationKeys.pseudo_fullscreen],
    description: locales[localizationKeys.pseudo_fullscreen_description], // Исправлено
    group: null,
    defaultSettings: false,
    section: 'main',
  },
  markVideoTimeLine: {
    type: 'checkbox',
    labelText: locales[localizationKeys.mark_video_timeline],
    description: locales[localizationKeys.mark_video_timeline_description], // Исправлено
    group: null,
    defaultSettings: true,
    section: 'additional',
  },
  clickToFullScreen: {
    type: 'checkbox',
    labelText: locales[localizationKeys.click_to_fullscreen],
    description: locales[localizationKeys.click_to_fullscreen_description], // Исправлено
    group: null,
    defaultSettings: false,
    section: 'additional',
  },
  addSpeedControl: {
    type: 'checkbox',
    labelText: locales[localizationKeys.add_speed_control],
    description: locales[localizationKeys.add_speed_control_description], // Исправлено
    group: null,
    defaultSettings: false,
    section: 'additional',
  },
};

export const jutsuExtensionDefaultConfig = Object.fromEntries(
  Object.entries(jutsuExtensionButtonsConfig).map(([id, config]) => [
    id,
    config.defaultSettings,
  ])
);

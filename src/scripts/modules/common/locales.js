import Browser from 'webextension-polyfill';

export const localizationKeys = {
  extension: 'extension',
  status_enabled: 'status_enabled',
  status_disabled: 'status_disabled',
  next_series_before_end: 'next_series_before_end',
  next_series_after_end: 'next_series_after_end',
  skip_intro: 'skip_intro',
  video_from_start: 'video_from_start',
  click_to_fullscreen: 'click_to_fullscreen',
  mark_video_timeline: 'mark_video_timeline',
  add_speed_control: 'add_speed_control',
  pseudo_fullscreen: 'pseudo_fullscreen',
  showMain: 'showMain',
  showAdditional: 'showAdditional',
  extension_description: 'extension_description',
  next_series_before_end_description: 'next_series_before_end_description',
  next_series_after_end_description: 'next_series_after_end_description',
  skip_intro_description: 'skip_intro_description',
  video_from_start_description: 'video_from_start_description',
  pseudo_fullscreen_description: 'pseudo_fullscreen_description',
  mark_video_timeline_description: 'mark_video_timeline_description',
  click_to_fullscreen_description: 'click_to_fullscreen_description',
  add_speed_control_description: 'add_speed_control_description',
  title: 'title',
  version: 'version',
  page_description: 'page_description',
  settings_title: 'settings_title',
  settings_description: 'settings_description',
  settings_note: 'settings_note',
  shortcuts_title: 'shortcuts_title',
  shortcuts_description: 'shortcuts_description',
  shortcut_numbers: 'shortcut_numbers',
  shortcut_numbers_desc: 'shortcut_numbers_desc',
  shortcut_f: 'shortcut_f',
  shortcut_f_desc: 'shortcut_f_desc',
  shortcut_m: 'shortcut_m',
  shortcut_m_desc: 'shortcut_m_desc',
  shortcut_t: 'shortcut_t',
  shortcut_t_desc: 'shortcut_t_desc',
  footer_text: 'footer_text',
  footer_link: 'footer_link',
};

/**
 * Retrieves the localized message for the specified key using Chrome's i18n API.
 * If the message is missing, it returns a default error message.
 *
 * @param {string} key - The key for which the localized message is requested.
 * @returns {string} The localized message if found, or an error message.
 */
export function getI18nMessage(key) {
  const message = Browser.i18n.getMessage(key);
  return message || `Missing localization for "${key}"`;
}

/**
 * Creates an object containing localized messages using Chrome's i18n API.
 *
 * @returns {Object} The localization messages.
 */
function createChromeLocales() {
  return Object.keys(localizationKeys).reduce(
    (locales, key) => ({
      ...locales,
      [key]: getI18nMessage(localizationKeys[key]),
    }),
    {}
  );
}

/**
 * Retrieves all localized messages.
 *
 * @returns {Object} The localization messages.
 */
export function getLocales() {
  return createChromeLocales();
}

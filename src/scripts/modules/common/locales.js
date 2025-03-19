import Browser from 'webextension-polyfill';

import localizationKeys from './localizationKeys';

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

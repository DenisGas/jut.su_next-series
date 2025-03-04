/* eslint-disable import/no-unresolved */
import Browser from 'webextension-polyfill';
import initializeUI from './modules/popup/ui';
import ToggleField from './modules/popup/toggleField';
import DisabledExtensionCheckbox from './modules/popup/DisabledExtensionCheckbox';
import Extension from './modules/popup/extension';
import {
  jutsuExtensionButtonsConfig,
  jutsuExtensionDefaultConfig,
} from './modules/common/сonfig';

initializeUI();

const buttons = Object.entries(jutsuExtensionButtonsConfig).map(
  ([id, config]) => {
    if (config.type === 'extensionSwitch') {
      return new DisabledExtensionCheckbox(
        id,
        config.labelText,
        config.type,
        config.section,
        config.statusClass,
        config.statusTextEnabled,
        config.statusTextDisabled,
        config.description
      );
    }
    return new ToggleField(
      id,
      config.labelText,
      config.type,
      config.section,
      config.description,
      config.group
    );
  }
);

buttons.forEach((button) => {
  let parentElement;

  if (button.type === 'radio') {
    parentElement = document.querySelector(
      `#${button.section}-section .radios`
    );
  } else if (button.type === 'checkbox') {
    parentElement = document.querySelector(
      `#${button.section}-section .checkboxes`
    );
  } else {
    parentElement = document.querySelector('#extension-toggle-section');
  }

  if (parentElement) {
    button.addToPage(parentElement);
  }
});

// eslint-disable-next-line no-unused-vars
const extension = new Extension(buttons, jutsuExtensionDefaultConfig);

document.getElementById('openPage').addEventListener('click', () => {
  Browser.tabs.create({
    url: Browser.runtime.getURL('pages/settings.html'), // путь из `manifest.json`
  });
});

// popup.js
import { initializeUI } from './modules/popup/ui.js';
import { ToggleField} from './modules/popup/toggleField.js';
import { DisabledExtensionCheckbox } from './modules/popup/DisabledExtensionCheckbox.js';
import { Extension } from './modules/popup/extension.js';
import { jutsuExtensionButtonsConfig, jutsuExtensionDefaultConfig } from './modules/common/Config.js';

initializeUI();

const buttons = Object.entries(jutsuExtensionButtonsConfig).map(([id, config]) => {
  if (config.type === 'extensionSwitch') {
    return new DisabledExtensionCheckbox(id, config.labelText, config.type, config.section, config.statusClass, config.statusTextEnabled, config.statusTextDisabled);
  } else {
    return new ToggleField(id, config.labelText, config.type, config.section, config.group);
  }
});

buttons.forEach(button => {
  const parentElement = document.querySelector(
    button.type === 'radio'
      ? `#${button.section}-section .radios`
      : button.type === 'checkbox'
      ? `#${button.section}-section .checkboxes`
      : '#extension-toggle-section'
  );
  if (parentElement) button.addToPage(parentElement);
});

const extension = new Extension(buttons, jutsuExtensionDefaultConfig);

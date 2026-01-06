// createPageButtons.js
import ToggleField from '../../popup/toggleField';
import DisabledExtensionCheckbox from '../../popup/DisabledExtensionCheckbox';
import { jutsuExtensionButtonsConfig } from '../../common/сonfig';

export function createPageButtons() {
  return Object.entries(jutsuExtensionButtonsConfig).map(([id, config]) => {
    if (
      config.type === 'extensionSwitch' &&
      Object.prototype.hasOwnProperty.call(config, 'statusTextEnabled')
    ) {
      return new DisabledExtensionCheckbox(
        id,
        config.labelText,
        config.type,
        null,
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
      null,
      config.description,
      config.group
    );
  });
}
export default createPageButtons;

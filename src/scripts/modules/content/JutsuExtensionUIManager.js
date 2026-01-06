// JutsuExtensionUIManager.js
import Extension from '../popup/extension';
import { jutsuExtensionDefaultConfig } from '../common/сonfig';
import JutsuSettingsRenderer from './ui/JutsuSettingsRenderer';
import PageSettingsSyncManager from './ui/PageSettingsSyncManager ';

export default class JutsuExtensionUIManager {
  constructor(containerSelector = '.plus_settings_info') {
    this.containerSelector = containerSelector;
    this.extension = null;
    this.syncManager = null;
  }

  render() {
    const container = document.querySelector(this.containerSelector);
    if (!container) return;

    const renderer = new JutsuSettingsRenderer();
    const buttons = renderer.render(container);

    this.extension = new Extension(buttons, jutsuExtensionDefaultConfig);

    this.syncManager = new PageSettingsSyncManager(this.extension);
    this.syncManager.init();
  }

  destroy() {
    this.syncManager?.destroy?.();
  }
}

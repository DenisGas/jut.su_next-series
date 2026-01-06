// PageSettingsSyncManager.js
import storage from '../../common/storage';

export default class PageSettingsSyncManager {
  constructor() {
    this.isApplyingFromExtension = false;
    this.siteCheckboxes = {
      next: 'p_set_next',
      skip: 'p_set_skip',
    };
  }

  init() {
    this.bindSiteControls();
    this.bindStorage();
  }

  /* ================= SITE → EXTENSION ================= */
  bindSiteControls() {
    const next = document.getElementById(this.siteCheckboxes.next);
    const skip = document.getElementById(this.siteCheckboxes.skip);

    if (next) {
      next.addEventListener('change', async () => {
        if (!next.checked) return;

        const config = await storage.getLocalItem('jutsuExtensionConfig');

        // Якщо сайт увімкнув стандартну функцію — вимикаємо свої
        config.nextSeriesOff = true;
        config.nextSeriesBeforeEnd = false;
        config.nextSeriesAfterEnd = false;

        await storage.setLocalItem('jutsuExtensionConfig', config);
      });
    }

    if (skip) {
      skip.addEventListener('change', async () => {
        if (!skip.checked) return;

        const config = await storage.getLocalItem('jutsuExtensionConfig');

        config.skipIntro = false;

        await storage.setLocalItem('jutsuExtensionConfig', config);
      });
    }
  }

  /* ================= EXTENSION → SITE ================= */
  bindStorage() {
    storage.onChanged((changes, area) => {
      if (area !== 'local' || !changes.jutsuExtensionConfig) return;

      const config = changes.jutsuExtensionConfig.newValue;

      this.applySiteSetting(
        this.siteCheckboxes.next,
        !(config.nextSeriesBeforeEnd || config.nextSeriesAfterEnd)
      );

      this.applySiteSetting(this.siteCheckboxes.skip, !config.skipIntro);
    });
  }

  applySiteSetting(id, shouldBeEnabled) {
    const checkbox = document.getElementById(id);
    if (!checkbox) return;

    const isEnabled =
      checkbox.checked || checkbox.classList.contains('mchat_slider-active');

    if (isEnabled === shouldBeEnabled) return;

    this.isApplyingFromExtension = true;
    checkbox.click();

    setTimeout(() => {
      this.isApplyingFromExtension = false;
    }, 300);
  }
}

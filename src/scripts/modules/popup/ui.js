// ui.js
export function initializeUI() {
  const toggleBtn = document.getElementById('toggle-settings');
  const mainSection = document.getElementById('main-section');
  const extensionToggleSection = document.getElementById('extension-toggle-section');
  const additionalSection = document.getElementById('additional-section');

  document.querySelectorAll('[data-locale]').forEach(element => {
    const key = element.getAttribute('data-locale');
    element.textContent = chrome.i18n.getMessage(key);
  });

  mainSection.style.display = 'block';
  extensionToggleSection.style.display = 'block';
  additionalSection.style.display = 'none';
  toggleBtn.textContent = chrome.i18n.getMessage('showAdditional');

  toggleBtn.addEventListener('click', function () {
    if (mainSection.style.display === 'none' || extensionToggleSection.style.display === 'none') {
      mainSection.style.display = 'block';
      additionalSection.style.display = 'none';
      toggleBtn.textContent = chrome.i18n.getMessage('showAdditional');
    } else {
      mainSection.style.display = 'none';
      additionalSection.style.display = 'block';
      toggleBtn.textContent = chrome.i18n.getMessage('showMain');
    }
  });
}

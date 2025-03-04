/* eslint-disable no-param-reassign */
import { getLocales } from '../common/locales';

// Функция для локализации
function applyLocalization(locales) {
  document.querySelectorAll('[data-locale]').forEach((el) => {
    const key = el.getAttribute('data-locale');
    el.textContent = locales[key] || `Missing: ${key}`;
  });
}

// Функция переключения секций
function toggleSections(locales, mainSection, additionalSection, toggleBtn) {
  const isMainVisible = mainSection.style.display !== 'none';

  const newMainDisplay = isMainVisible ? 'none' : 'block';
  const newAdditionalDisplay = isMainVisible ? 'block' : 'none';
  const newButtonText = isMainVisible
    ? locales.showMain || 'Show Main'
    : locales.showAdditional || 'Show Additional';

  mainSection.style.display = newMainDisplay;
  additionalSection.style.display = newAdditionalDisplay;
  toggleBtn.textContent = newButtonText;
}

// Главная функция инициализации UI
export default function initializeUI() {
  const locales = getLocales();
  console.log('Loaded locales:', locales);

  const toggleBtn = document.getElementById('toggle-settings');
  const mainSection = document.getElementById('main-section');
  const extensionToggleSection = document.getElementById(
    'extension-toggle-section'
  );
  const additionalSection = document.getElementById('additional-section');

  // Проверка существования элементов
  if (
    !toggleBtn ||
    !mainSection ||
    !extensionToggleSection ||
    !additionalSection
  ) {
    console.error(
      'One or more required elements are missing. UI initialization aborted.'
    );
    return;
  }

  // Применяем локализацию
  applyLocalization(locales);

  // Настройка начального состояния
  mainSection.style.display = 'block';
  extensionToggleSection.style.display = 'block';
  additionalSection.style.display = 'none';
  toggleBtn.textContent = locales.showAdditional || 'Show Additional';

  // Назначаем обработчик клика
  toggleBtn.addEventListener('click', () =>
    toggleSections(locales, mainSection, additionalSection, toggleBtn)
  );
}

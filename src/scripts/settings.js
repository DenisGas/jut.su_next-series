/* eslint-disable no-param-reassign */
import ToggleField from './modules/popup/toggleField';
import DisabledExtensionCheckbox from './modules/popup/DisabledExtensionCheckbox';
import Extension from './modules/popup/extension';
import {
  jutsuExtensionButtonsConfig,
  jutsuExtensionDefaultConfig,
} from './modules/common/сonfig';
import { getLocales } from './modules/common/locales';

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

/**
 * Создаёт элемент описания для кнопки с поддержкой HTML-разметки.
 *
 * @param {string} description - Текст описания с возможной HTML-разметкой.
 * @param {string} [imageSrc] - Опциональный путь к изображению.
 * @returns {HTMLElement} - Контейнер с описанием и разделительной линией.
 */
function createButtonDescriptionElement(description, imageSrc = null) {
  const container = document.createElement('div');
  container.classList.add('button-description');

  const descText = document.createElement('div'); // Используем div вместо p для большей гибкости
  descText.innerHTML = description; // Вставляем HTML напрямую
  container.appendChild(descText);

  if (imageSrc) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = 'Описание';
    img.classList.add('description-image');
    container.appendChild(img);
  }

  return container;
}

const groupedButtons = {}; // Группируем кнопки по `name`

buttons.forEach((button) => {
  console.log(button);
  console.log(button.description);

  let parentElement;

  if (button.type === 'radio') {
    parentElement = document.querySelector(`#main-section .radios`);
  } else if (button.type === 'checkbox') {
    parentElement = document.querySelector(`#main-section .checkboxes`);
  } else {
    parentElement = document.querySelector('#extension-toggle-section');
  }

  if (!parentElement) return;

  if (button.name && button.type === 'radio') {
    // Если есть `name` и это радио-кнопка, группируем
    if (!groupedButtons[button.name]) {
      groupedButtons[button.name] = document.createElement('section');
      groupedButtons[button.name].classList.add('extension_toggle');
      groupedButtons[button.name].classList.add('extension_toggle_group');

      // Добавляем секцию в родителя
      parentElement.appendChild(groupedButtons[button.name]);
    }

    // Создаём обёртку для кнопки и её описания
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button-wrapper');

    // Добавляем кнопку
    button.addToPage(buttonWrapper);

    // Создаём описание
    const descriptionElement = createButtonDescriptionElement(
      button.description,
      button.imageSrc
    );

    // Добавляем в обёртку
    buttonWrapper.appendChild(descriptionElement);

    // Вставляем в родительскую секцию
    groupedButtons[button.name].appendChild(buttonWrapper);
  } else {
    // Для остальных кнопок создаём отдельную секцию
    const wrapper = document.createElement('section');
    wrapper.classList.add('extension_toggle');

    // Создаём обёртку для кнопки и её описания
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button-wrapper');

    button.addToPage(buttonWrapper);

    const descriptionElement = createButtonDescriptionElement(
      button.description,
      button.imageSrc
    );

    buttonWrapper.appendChild(descriptionElement);
    wrapper.appendChild(buttonWrapper);

    parentElement.appendChild(wrapper);
  }
});

function applyLocalization(locales) {
  document.querySelectorAll('[data-locale]').forEach((el) => {
    const key = el.getAttribute('data-locale');
    el.innerHTML = locales[key] || `Missing: ${key}`;
  });
}

// eslint-disable-next-line no-unused-vars
const extension = new Extension(buttons, jutsuExtensionDefaultConfig);

const locales = getLocales();
// console.log('Loaded locales:', locales);

applyLocalization(locales);

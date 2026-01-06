import { createPageButtons } from './createPageButtons.js';

export default class JutsuSettingsRenderer {
  render(container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'jutsu-extension-settings';

    const title = document.createElement('h3');
    title.textContent = 'Jutsu Extension Settings';

    wrapper.appendChild(title);

    const buttons = createPageButtons();

    buttons.forEach((button) => {
      button.addToPage(wrapper);
    });

    container.appendChild(wrapper);

    return buttons;
  }
}

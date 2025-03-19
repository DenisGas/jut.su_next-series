import ToggleField from './toggleField';

export default class DisabledExtensionCheckbox extends ToggleField {
  constructor(
    id,
    labelText,
    btnType,
    section,
    statusClass,
    statusEnabled,
    statusDisabled,
    description
  ) {
    super(id, labelText, btnType, section, description);
    this.statusClass = statusClass;
    this.statusEnabled = statusEnabled;
    this.statusDisabled = statusDisabled;
    this.element = this.createElem();
  }

  setChecked(checked) {
    super.setChecked(checked);
    this.changeStatus();
  }

  getNowStatus() {
    return this.isChecked() ? this.statusEnabled : this.statusDisabled;
  }

  // eslint-disable-next-line class-methods-use-this
  setStatus(statusElem, textContent, addClass) {
    // eslint-disable-next-line no-param-reassign
    statusElem.textContent = textContent;
    if (addClass && !statusElem.classList.contains('enabled')) {
      statusElem.classList.add('enabled');
    } else if (!addClass && statusElem.classList.contains('enabled')) {
      statusElem.classList.remove('enabled');
    }
  }

  changeStatus() {
    const isChecked = this.isChecked();
    const statusElem = document.getElementById(`${this.id}Status`);
    const newText = isChecked ? this.statusEnabled : this.statusDisabled;
    this.setStatus(statusElem, newText, isChecked);
  }

  createElem() {
    const label = super.createElem();
    const statusElem = document.createElement('span');
    statusElem.textContent = this.statusDisabled;
    statusElem.id = `${this.id}Status`;
    statusElem.classList = this.statusClass;
    label.appendChild(statusElem);
    return label;
  }
}

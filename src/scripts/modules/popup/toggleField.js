// toggleField.js
export class ToggleField {
  constructor(id, labelText, btnType, section, name = null) {
    this.id = id;
    this.labelText = labelText;
    this.type = btnType;
    this.section = section;
    this.name = name;
  }

  createElem() {
    const label = document.createElement('label');
    label.id = this.id + 'Label';

    const input = document.createElement(this.type === 'radio' ? 'input' : 'input');
    input.className = this.type === 'radio' ? 'radio' : 'checkbox';
    input.id = this.id;
    if (this.type === 'radio') {
      input.name = this.name;
      input.type = 'radio';
    } else {
      input.type = 'checkbox';
    }

    label.appendChild(input);
    label.appendChild(document.createTextNode(this.labelText));

    return label;
  }

  isChecked() {
    return document.getElementById(this.id).checked;
  }

  setChecked(checked) {
    document.getElementById(this.id).checked = checked;
  }

  setDisabled(disabled) {
    document.getElementById(this.id).disabled = disabled;
  }

  addToPage(parentElement) {
    parentElement.appendChild(this.createElem());
  }
}

export class DisabledExtensionCheckbox extends ToggleField {
  constructor(id, labelText, btnType, section, statusClass, statusEnabled, statusDisabled) {
    super(id, labelText, btnType, section);
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

  setStatus(statusElem, textContent, addClass) {
    statusElem.textContent = textContent;
    if (addClass && !statusElem.classList.contains("enabled")) {
      statusElem.classList.add("enabled");
    } else if (!addClass && statusElem.classList.contains("enabled")) {
      statusElem.classList.remove("enabled");
    }
  }

  changeStatus() {
    const isChecked = this.isChecked();
    const statusElem = document.getElementById(this.id + 'Status');
    const newText = isChecked ? this.statusEnabled : this.statusDisabled;
    this.setStatus(statusElem, newText, isChecked);
  }

  createElem() {
    const label = super.createElem();
    const statusElem = document.createElement('span');
    statusElem.textContent = this.statusDisabled;
    statusElem.id = this.id + 'Status';
    statusElem.classList = this.statusClass;
    label.appendChild(statusElem);
    return label;
  }
}

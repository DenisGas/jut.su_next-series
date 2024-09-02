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

import { ToggleField } from "./toggleField";

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
  
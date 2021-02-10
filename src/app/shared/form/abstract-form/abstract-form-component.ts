import { ControlValueAccessor } from '@angular/forms';

export abstract class AbstractFormComponent implements ControlValueAccessor {
  value: any;
  isDisabled: boolean;
  onChange = (_: any) => {};
  onTouch = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}

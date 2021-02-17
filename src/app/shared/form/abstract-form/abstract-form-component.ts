import { ControlValueAccessor } from '@angular/forms';

export abstract class AbstractFormComponent<T> implements ControlValueAccessor {
  public value: any;
  public isDisabled: boolean;
  public onChange = (_: any) => {};
  public onTouch = () => {};

  public writeValue(value: T): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}

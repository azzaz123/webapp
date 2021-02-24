import { ControlValueAccessor } from '@angular/forms';

export abstract class AbstractFormComponent<T> implements ControlValueAccessor {
  public value: T;
  public isDisabled: boolean;
  public onChange = (_: unknown) => {};
  public onTouch = () => {};

  public writeValue(value: T): void {
    this.value = value;
  }

  public registerOnChange(fn: (_: unknown) => void): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}

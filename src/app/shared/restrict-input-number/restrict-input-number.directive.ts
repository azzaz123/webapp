import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[tslRestrictInputNumber]',
})
export class RestrictInputNumberDirective {
  constructor() {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const key = event.keyCode;
    if (
      !(
        // numbers
        (
          (key >= 48 && key <= 57) ||
          // Numeric keypad
          (key >= 96 && key <= 105) ||
          // comma
          key === 188 ||
          // Backspace and Tab and Enter
          key === 8 ||
          key === 9 ||
          key === 13 ||
          // Home and End
          key === 35 ||
          key === 36 ||
          // left and right arrows
          key === 37 ||
          key === 39 ||
          // Del and Ins
          key === 46 ||
          key === 45
        )
      )
    ) {
      event.preventDefault();
    }
  }
}

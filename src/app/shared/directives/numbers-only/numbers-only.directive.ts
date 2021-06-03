import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[tslNumbersOnly]',
})
export class NumbersOnlyDirective {
  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    const key = e.key;
    if (key === 'Backspace') {
      return;
    }
    if (isNaN(Number(key)) || key === ' ') {
      e.preventDefault();
    }
  }
}

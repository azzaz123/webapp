import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[tslNumbersOnly]',
})
export class NumbersOnlyDirective {
  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    const key = e.key;
    const isBackSpace = key === 'Backspace';
    const isNotANumber = isNaN(Number(key));
    const isASpace = key === ' ';

    if ((isNotANumber || isASpace) && !isBackSpace) {
      e.preventDefault();
    }
  }
}

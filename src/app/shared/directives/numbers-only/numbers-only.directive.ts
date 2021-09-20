import { Directive, HostListener } from '@angular/core';

const allowedKeys: string[] = ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Backspace', 'Delete', 'Tab'];

@Directive({
  selector: '[tslNumbersOnly]',
})
export class NumbersOnlyDirective {
  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    const key = e.key;
    const isNotANumber = isNaN(Number(key));

    if (isNotANumber && !allowedKeys.find((item) => item === key)) {
      e.preventDefault();
    }
  }
}

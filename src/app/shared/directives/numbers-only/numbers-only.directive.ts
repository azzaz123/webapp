import { Directive, HostListener } from '@angular/core';

const allowedKeys: string[] = ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Backspace', 'Delete', 'Tab'];
const disallowedKeys: string[] = [' ', 'e', 'E'];

@Directive({
  selector: '[tslNumbersOnly]',
})
export class NumbersOnlyDirective {
  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    if (!this.isAllowed(e.key)) {
      e.preventDefault();
    }
  }
  private isAllowed(key: string): boolean {
    const isNumber = !isNaN(Number(key));
    const isDisallowed = !!disallowedKeys.find((item) => item === key);
    const isAllowed = !!allowedKeys.find((item) => item === key);

    return (isNumber && !isDisallowed) || isAllowed;
  }
}

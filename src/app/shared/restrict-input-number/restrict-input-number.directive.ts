import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[tslRestrictInputNumber]'
})
export class RestrictInputNumberDirective {

  constructor() {
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.key === 'e' || event.key === '-' || event.key === '+' || event.key === '.') {
      event.preventDefault();
    }
  }

}

import { Directive, HostListener } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[preventDoubleClick]',
})
export class PreventDoubleClickDirective {
  private alreadyClicked = false;

  constructor() {}

  @HostListener('click', ['$event'])
  clickEvent(event) {
    if (this.alreadyClicked) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.alreadyClicked = true;
      setTimeout(() => (this.alreadyClicked = false), 500);
    }
  }
}

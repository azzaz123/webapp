import { Directive, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[carousel-slider]',
})
export class CarouselSliderDirective {
  constructor(public templateRef: TemplateRef<HTMLElement>) {}
}

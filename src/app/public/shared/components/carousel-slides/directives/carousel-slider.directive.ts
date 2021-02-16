import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[carousel-slider]',
})
export class CarouselSliderDirective {
  constructor(public templateRef: TemplateRef<HTMLElement>) {}
}

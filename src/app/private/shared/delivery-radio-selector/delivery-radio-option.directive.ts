import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tslDeliveryRadioOption]',
})
export class DeliveryRadioOptionDirective {
  constructor(public templateRef: TemplateRef<HTMLElement>) {}
}

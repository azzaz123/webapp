import { Directive, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[step]',
})
export class StepDirective {
  constructor(public templateRef: TemplateRef<HTMLElement>) {}
}

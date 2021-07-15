import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[step]',
})
export class StepDirective {
  constructor(public templateRef: TemplateRef<HTMLElement>) {}
}

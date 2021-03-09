import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[tslFilterHost]',
})
export class FilterHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

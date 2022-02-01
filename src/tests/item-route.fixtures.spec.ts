import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[tslItemRoute]',
})
export class ItemRouteMockDirective {
  @Input() itemSlug: string;
  @Input() itemUUID: string;

  constructor() {}
}

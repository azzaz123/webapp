import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[tslItemRoute]',
})
export class ItemRouteDirectiveMock {
  @Input() itemSlug: string;
  @Input() itemUUID: string;

  constructor() {}
}

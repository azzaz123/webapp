import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-public-item-card-list',
  template: '',
})
// tslint:disable-next-line: component-class-suffix
export class ItemCardListComponentStub {
  @Input() items: Item[];
  @Input() showDescription = true;
}

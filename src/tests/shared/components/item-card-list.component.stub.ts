import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-public-item-card-list',
  template: '',
})
export class ItemCardListComponentStub {
  @Input() items: Item[];
  @Input() showDescription = true;
}

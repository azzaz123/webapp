import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';

@Component({
  selector: 'tsl-public-item-card-list',
  template: '',
})
// tslint:disable-next-line: component-class-suffix
export class ItemCardListComponentStub {
  @Input() items: Item[];
  @Input() showDescription = true;
  @Input() columnsConfig: ColumnsConfig;
}

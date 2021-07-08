import { Component, Input } from '@angular/core';
import { AdShoppingPageOptions } from '@core/ads/models';
import { CARD_TYPES } from '@public/shared/components/item-card-list/enums/card-types.enum';

@Component({
  selector: 'tsl-sky-shopping',
  template: '{{adSlotContainer}}',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AdSlotShoppingComponentStub {
  @Input() adShoppingPageOptions: AdShoppingPageOptions;
  @Input() adSlotContainer: string;
  @Input() index: number;
  @Input() cardType: CARD_TYPES = CARD_TYPES.REGULAR;
}

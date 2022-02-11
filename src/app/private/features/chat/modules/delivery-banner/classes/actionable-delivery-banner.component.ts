import { Directive, EventEmitter, Output } from '@angular/core';
import { DELIVERY_BANNER_ACTION } from '../enums/delivery-banner-action.enum';
import { AbstractDeliveryBannerComponent } from './abstract-delivery-banner.component';

@Directive()
export abstract class ActionableDeliveryBannerComponent extends AbstractDeliveryBannerComponent {
  @Output() clickedCTA: EventEmitter<DELIVERY_BANNER_ACTION>;
}

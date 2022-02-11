import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { DELIVERY_BANNER_ACTION } from '../enums/delivery-banner-action.enum';
import { ActionableDeliveryBanner } from '../interfaces/actionable-delivery-banner.interface';
import { AbstractDeliveryBannerComponent } from './abstract-delivery-banner.component';

@Directive()
export abstract class ActionableDeliveryBannerComponent extends AbstractDeliveryBannerComponent {
  @Input() bannerProperties: ActionableDeliveryBanner;
  @Output() clickedCTA: EventEmitter<DELIVERY_BANNER_ACTION> = new EventEmitter<DELIVERY_BANNER_ACTION>();

  public handleClickCTA(): void {
    this.clickedCTA.emit(this.bannerProperties.action);
  }
}

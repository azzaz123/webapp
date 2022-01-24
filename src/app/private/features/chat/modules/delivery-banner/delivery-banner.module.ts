import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryBannerComponent } from './delivery-banner.component';

@NgModule({
  declarations: [DeliveryBannerComponent],
  exports: [DeliveryBannerComponent],
  imports: [CommonModule],
})
export class DeliveryBannerModule {}

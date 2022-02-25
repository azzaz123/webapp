import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from '@shared/button/button.module';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { PayviewDeliveryHeaderComponent } from '@private/features/payview/modules/delivery/components/header/payview-delivery-header.component';
import { PayviewDeliveryOverviewComponent } from '@private/features/payview/modules/delivery/components/overview/payview-delivery-overview.component';
import { PayviewDeliveryPointsComponent } from '@private/features/payview/modules/delivery/components/points/payview-delivery-points.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [ButtonModule, CommonModule, DeliveryRadioSelectorModule, SvgIconModule],
  declarations: [PayviewDeliveryHeaderComponent, PayviewDeliveryOverviewComponent, PayviewDeliveryPointsComponent],
  providers: [],
  exports: [PayviewDeliveryOverviewComponent],
})
export class PayviewDeliveryModule {}

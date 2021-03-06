import { NgModule } from '@angular/core';
import { acceptScreenRoutedComponents, AcceptScreenRoutingModule } from './accept-screen.routing.module';
import { CommonModule } from '@angular/common';
import { AcceptScreenModalComponent } from './modals/accept-screen-modal/accept-screen-modal.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';
import { StepperModule } from '@shared/stepper/stepper.module';
import { DeliveryAddressModule } from '../delivery/pages/delivery-address/delivery-address.module';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { DeliveryMapModule } from '@private/shared/delivery-map/delivery-map.module';
import { DeliveryPreferenceScheduleComponent } from './components/steps/delivery-preference-schedule/delivery-preference-schedule.component';
import { FormsModule } from '@angular/forms';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    ButtonModule,
    AcceptScreenRoutingModule,
    CommonModule,
    UserAvatarModule,
    StepperModule,
    DeliveryAddressModule,
    SvgIconModule,
    CustomCurrencyModule,
    DeliveryRadioSelectorModule,
    DeliveryMapModule,
    FormsModule,
    NgbButtonsModule,
    SvgIconModule,
  ],
  declarations: [acceptScreenRoutedComponents, AcceptScreenModalComponent, ProductCardComponent, DeliveryPreferenceScheduleComponent],
})
export class AcceptScreenModule {}

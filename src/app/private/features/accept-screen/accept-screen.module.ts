import { NgModule } from '@angular/core';
import { acceptScreenRoutedComponents, AcceptScreenRoutingModule } from './accept-screen.routing.module';
import { CommonModule } from '@angular/common';
import { AcceptScreenModalComponent } from './modals/accept-screen-modal/accept-screen-modal.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';
import { DeliveryMethodSelectorModule } from '@private/shared/components/delivery-method-selector/delivery-method-selector.module';
import { StepperModule } from '@shared/stepper/stepper.module';
import { DeliveryAddressModule } from '../delivery/pages/delivery-address/delivery-address.module';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [
    ButtonModule,
    AcceptScreenRoutingModule,
    CommonModule,
    UserAvatarModule,
    DeliveryMethodSelectorModule,
    StepperModule,
    DeliveryAddressModule,
    SvgIconModule,
  ],
  declarations: [acceptScreenRoutedComponents, AcceptScreenModalComponent, ProductCardComponent],
})
export class AcceptScreenModule {}

import { NgModule } from '@angular/core';
import { acceptScreenRoutedComponents, AcceptScreenRoutingModule } from './accept-screen.routing.module';
import { CommonModule } from '@angular/common';
import { AcceptScreenModalComponent } from './modals/accept-screen-modal/accept-screen-modal.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  imports: [AcceptScreenRoutingModule, CommonModule, UserAvatarModule, CustomCurrencyModule, DeliveryRadioSelectorModule, ButtonModule],
  declarations: [acceptScreenRoutedComponents, AcceptScreenModalComponent, ProductCardComponent],
})
export class AcceptScreenModule {}

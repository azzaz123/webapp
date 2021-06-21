import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { deliveryRoutedComponents, DeliveryRoutingModule } from './delivery.routing.module';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { HeaderModule } from '@shared/header/header.module';
import { PaymentsCreditCardModule } from '@api/payments/cards/payments-credit-card.module';

@NgModule({
  declarations: [deliveryRoutedComponents],
  imports: [CommonModule, DeliveryRoutingModule, NavLinksModule, HeaderModule, PaymentsCreditCardModule],
})
export class DeliveryModule {}

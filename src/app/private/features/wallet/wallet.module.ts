import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { HeaderModule } from '@shared/header/header.module';
import { WalletRoutedComponents, WalletRoutingModule } from './wallet.routing.module';
import { PaymentsCreditCardModule } from '@api/payments/cards';

@NgModule({
  declarations: [WalletRoutedComponents],
  imports: [CommonModule, WalletRoutingModule, NavLinksModule, HeaderModule, PaymentsCreditCardModule],
})
export class WalletModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { HeaderModule } from '@shared/header/header.module';
import { WalletRoutedComponents, WalletRoutingModule } from './wallet.routing.module';
import { PaymentsCreditCardModule } from '@api/payments/cards';
import { KycBannerModule } from './components/kyc-banner/kyc-banner.module';
import { KycBannerService } from './services/kyc-banner/kyc-banner.service';
import { KycBannerApiService } from './services/api/kyc-banner-api.service';

@NgModule({
  declarations: [WalletRoutedComponents],
  imports: [CommonModule, WalletRoutingModule, NavLinksModule, HeaderModule, PaymentsCreditCardModule, KycBannerModule],
  providers: [KycBannerService, KycBannerApiService],
})
export class WalletModule {}
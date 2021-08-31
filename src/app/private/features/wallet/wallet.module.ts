import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { HeaderModule } from '@shared/header/header.module';
import { WalletRoutedComponents, WalletRoutingModule } from './wallet.routing.module';
import { PaymentsCreditCardModule } from '@api/payments/cards';
import { KYCInfoModalModule } from './modals/kyc-info-modal/kyc-info-modal.module';
import { KYCBannerService } from './services/kyc-banner/kyc-banner.service';
import { KYCBannerApiService } from './services/api/kyc-banner-api.service';
import { KYCBannerModule } from './components/kyc-banner/kyc-banner.module';
import { KYCGuard } from './guards/kyc/kyc.guard';
import { KYCModule } from './modals/kyc/kyc.module';

@NgModule({
  declarations: [WalletRoutedComponents],
  imports: [
    CommonModule,
    WalletRoutingModule,
    NavLinksModule,
    HeaderModule,
    PaymentsCreditCardModule,
    KYCInfoModalModule,
    KYCBannerModule,
    KYCModule,
  ],
  providers: [KYCBannerService, KYCBannerApiService, KYCGuard],
})
export class WalletModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { HeaderModule } from '@shared/header/header.module';
import { WalletRoutedComponents, WalletRoutingModule } from './wallet.routing.module';
import { PaymentsCreditCardModule } from '@api/payments/cards';
import { KYCInfoModalModule } from './modals/kyc-info-modal/kyc-info-modal.module';
import { KYCBannerModule } from './components/kyc-banner/kyc-banner.module';
import { KYCGuard } from './guards/kyc/kyc.guard';
import { KYCModule } from './modals/kyc/kyc.module';
import { KYCStatusModalModule } from './modals/kyc-status-modal/kyc-status-modal.module';
import { KYCStatusApiService } from './services/api/kyc-status-api/kyc-status-api.service';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';

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
    KYCStatusModalModule,
  ],
  providers: [KYCPropertiesService, KYCStatusApiService, KYCGuard],
})
export class WalletModule {}

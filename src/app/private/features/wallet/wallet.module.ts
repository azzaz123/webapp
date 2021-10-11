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
import { KYCPropertiesHttpService } from '@api/payments/kyc-properties/http/kyc-properties-http.service';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { KYCTrackingEventsService } from './modals/kyc/services/kyc-tracking-events/kyc-tracking-events.service';
import { KYCAckModule } from '@api/delivery/kyc-ack/kyc-ack.module';
import { WalletBalanceTrackingEventService } from '@private/features/wallet/pages/wallet-balance/services/wallet-balance-tracking-event.service';

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
    KYCAckModule,
  ],
  providers: [KYCPropertiesService, KYCPropertiesHttpService, KYCGuard, KYCTrackingEventsService, WalletBalanceTrackingEventService],
})
export class WalletModule {}

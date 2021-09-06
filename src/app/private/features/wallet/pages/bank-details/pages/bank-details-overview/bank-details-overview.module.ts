import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsCardInfoModule } from '@shared/payments-card-info/payments-card-info.module';
import { BankAccountService } from '@private/features/wallet/services/bank-account/bank-account.service';
import { BankAccountApiService } from '@private/features/wallet/services/api/bank-account-api/bank-account-api.service';
import { MapBankAccountService } from '@private/features/wallet/services/bank-account/map-bank-account/map-bank-account.service';
import { AddCreditCardModule } from '@shared/add-credit-card/add-credit-card.module';
import { bankDetailsOverviewRoutedComponents, BankDetailsOverviewRoutingModule } from './bank-details-overview.routing.module';
import { BankAccountTrackingEventsService } from '../../services/bank-account-tracking-events/bank-account-tracking-events.service';

@NgModule({
  declarations: [bankDetailsOverviewRoutedComponents],
  imports: [BankDetailsOverviewRoutingModule, CommonModule, PaymentsCardInfoModule, AddCreditCardModule],
  providers: [BankAccountService, BankAccountApiService, MapBankAccountService, BankAccountTrackingEventsService],
})
export class BankDetailsOverviewModule {}

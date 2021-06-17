import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bankDetailsRoutedComponents, BankDetailsRoutingModule } from './bank-details.routing.module';
import { CreditCardInfoModule } from '@shared/credit-card-info/credit-card-info.module';
import { BankAccountService } from '../../services/bank-account/bank-account.service';
import { BankAccountApiService } from '../../services/api/bank-account-api/bank-account-api.service';
import { MapBankAccountService } from '../../services/bank-account/map-bank-account/map-bank-account.service';
import { AddCreditCardModule } from '@shared/add-credit-card/add-credit-card.module';

@NgModule({
  declarations: [bankDetailsRoutedComponents],
  imports: [BankDetailsRoutingModule, CommonModule, CreditCardInfoModule, AddCreditCardModule],
  providers: [BankAccountService, BankAccountApiService, MapBankAccountService],
})
export class BankDetailsModule {}

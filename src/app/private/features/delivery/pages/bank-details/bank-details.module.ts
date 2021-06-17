import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bankDetailsRoutedComponents, BankDetailsRoutingModule } from './bank-details.routing.module';
import { CreditCardInfoModule } from '@shared/credit-card-info/credit-card-info.module';

@NgModule({
  declarations: [bankDetailsRoutedComponents],
  imports: [BankDetailsRoutingModule, CommonModule, CreditCardInfoModule],
})
export class BankDetailsModule {}

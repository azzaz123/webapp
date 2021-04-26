import { NgModule } from '@angular/core';
import { bankAccountRoutedComponents, BankAccountRoutingModule } from './bank-account.routing.module';

@NgModule({
  imports: [BankAccountRoutingModule],
  declarations: [bankAccountRoutedComponents],
})
export class BankAccountModule {}

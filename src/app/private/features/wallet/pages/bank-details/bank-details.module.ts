import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bankDetailsRoutedComponents, BankDetailsRoutingModule } from './bank-details.routing.module';
import { SharedErrorActionModule } from '@shared/error-action';

@NgModule({
  declarations: [bankDetailsRoutedComponents],
  imports: [BankDetailsRoutingModule, CommonModule, SharedErrorActionModule],
})
export class BankDetailsModule {}

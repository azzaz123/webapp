import { NgModule } from '@angular/core';
import { KYCRoutedComponents, KYCRoutingModule } from './kyc.routing.module';
import { CommonModule } from '@angular/common';
import { StepperModule } from '@shared/stepper/stepper.module';
import { BankAccountModule } from '../bank-details/pages/bank-account/bank-account.module';

@NgModule({
  imports: [CommonModule, KYCRoutingModule, StepperModule, BankAccountModule],
  declarations: [KYCRoutedComponents],
})
export class KYCModule {}

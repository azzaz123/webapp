import { NgModule } from '@angular/core';
import { KYCRoutedComponents, KYCRoutingModule } from './kyc.routing.module';
import { CommonModule } from '@angular/common';
import { StepperModule } from '@shared/stepper/stepper.module';
import { BankAccountModule } from '../bank-details/pages/bank-account/bank-account.module';
import { KycNationalityComponent } from './components/kyc-nationality/kyc-nationality.component';
import { KycImagesComponent } from './components/kyc-images/kyc-images.component';

@NgModule({
  imports: [CommonModule, KYCRoutingModule, StepperModule, BankAccountModule],
  declarations: [KYCRoutedComponents, KycNationalityComponent, KycImagesComponent],
})
export class KYCModule {}

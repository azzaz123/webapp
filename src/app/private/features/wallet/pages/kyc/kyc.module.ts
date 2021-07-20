import { NgModule } from '@angular/core';
import { KYCRoutedComponents, KYCRoutingModule } from './kyc.routing.module';
import { CommonModule } from '@angular/common';
import { StepperModule } from '@shared/stepper/stepper.module';
import { BankAccountModule } from '../bank-details/pages/bank-account/bank-account.module';
import { KYCImagesComponent } from './components/kyc-images/kyc-images.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { KYCNationalityComponent } from './components/kyc-nationality/kyc-nationality.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, KYCRoutingModule, StepperModule, BankAccountModule, SvgIconModule, DropdownModule, FormsModule],
  declarations: [KYCRoutedComponents, KYCImagesComponent, KYCNationalityComponent],
})
export class KYCModule {}

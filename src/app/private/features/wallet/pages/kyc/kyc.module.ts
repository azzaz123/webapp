import { NgModule } from '@angular/core';
import { KYCRoutedComponents, KYCRoutingModule } from './kyc.routing.module';
import { CommonModule } from '@angular/common';
import { StepperModule } from '@shared/stepper/stepper.module';
import { BankAccountModule } from '../bank-details/pages/bank-account/bank-account.module';
import { KYCImageOptionsComponent } from './components/kyc-image-options/kyc-image-options.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { KYCNationalityComponent } from './components/kyc-nationality/kyc-nationality.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { KYCStoreService } from './services/kyc-store.service';

@NgModule({
  imports: [CommonModule, KYCRoutingModule, StepperModule, BankAccountModule, SvgIconModule, DropdownModule, FormsModule, ButtonModule],
  declarations: [KYCRoutedComponents, KYCImageOptionsComponent, KYCNationalityComponent],
  providers: [KYCStoreService],
})
export class KYCModule {}

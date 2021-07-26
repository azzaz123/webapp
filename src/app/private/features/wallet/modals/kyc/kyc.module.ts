import { NgModule } from '@angular/core';
import { KYCRoutedComponents, KYCRoutingModule } from './kyc.routing.module';
import { CommonModule } from '@angular/common';
import { StepperModule } from '@shared/stepper/stepper.module';
import { BankAccountModule } from '../../pages/bank-details/pages/bank-account/bank-account.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { KYCNationalityComponent } from './components/kyc-nationality/kyc-nationality.component';
import { KycModalComponent } from './modals/kyc-modal/kyc-modal.component';
import { KYCStoreService } from './services/kyc-store.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { KYCImageOptionsComponent } from './components/kyc-image-options/kyc-image-options.component';

@NgModule({
  imports: [CommonModule, KYCRoutingModule, StepperModule, BankAccountModule, SvgIconModule, DropdownModule, FormsModule, ButtonModule],
  declarations: [KYCRoutedComponents, KYCImageOptionsComponent, KYCNationalityComponent, KycModalComponent],
  providers: [KYCStoreService],
})
export class KYCModule {}

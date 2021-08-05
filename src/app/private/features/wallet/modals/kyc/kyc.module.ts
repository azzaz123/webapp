import { NgModule } from '@angular/core';
import { KYCRoutedComponents, KYCRoutingModule } from './kyc.routing.module';
import { CommonModule } from '@angular/common';
import { StepperModule } from '@shared/stepper/stepper.module';
import { BankAccountModule } from '../../pages/bank-details/pages/bank-account/bank-account.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { KYCNationalityComponent } from './components/kyc-nationality/kyc-nationality.component';
import { KYCModalComponent } from './modals/kyc-modal/kyc-modal.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { KYCImageOptionsComponent } from './components/kyc-image-options/kyc-image-options.component';
import { KYCUploadImagesComponent } from './components/kyc-upload-images/kyc-upload-images.component';
import { BannerModule } from '@shared/banner/banner.module';
import { KYCStoreService } from './services/kyc-store/kyc-store.service';
import { AskPermissionsService } from '@shared/services/ask-permissions/ask-permissions.service';
import { KYCServicesModule } from '@api/payments/kyc/kyc-services.module';

@NgModule({
  imports: [
    CommonModule,
    KYCRoutingModule,
    StepperModule,
    BankAccountModule,
    SvgIconModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    BannerModule,
  ],
  declarations: [KYCRoutedComponents, KYCImageOptionsComponent, KYCNationalityComponent, KYCModalComponent, KYCUploadImagesComponent],
  providers: [KYCStoreService, , AskPermissionsService, KYCServicesModule],
})
export class KYCModule {}

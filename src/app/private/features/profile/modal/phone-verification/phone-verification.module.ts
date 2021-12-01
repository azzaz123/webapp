import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { PhoneVerificationModalComponent } from './modals/phone-verification-modal/phone-verification-modal.component';
import { PhoneVerificationRoutedComponents, PhoneVerificationRoutingModule } from './phone-verification.routing.module';
import { UserVerificationsModule } from '@api/user-verifications/user-verifications.module';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { SmsCodeVerificationModalComponent } from './modals/sms-code-verification-modal/sms-code-verification-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SvgIconModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    UserVerificationsModule,
    PhoneVerificationRoutingModule,
  ],
  declarations: [PhoneVerificationRoutedComponents, PhoneVerificationModalComponent, SmsCodeVerificationModalComponent],
})
export class PhoneVerificationModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { EmailVerificationModalComponent } from './modals/email-verification-modal/email-verification-modal.component';
import { EmailVerificationRoutedComponents, EmailVerificationRoutingModule } from './email-verification.routing.module';
import { UserVerificationsModule } from '@api/user-verifications/user-verifications.module';

@NgModule({
  imports: [CommonModule, SvgIconModule, ButtonModule, FormsModule, UserVerificationsModule, EmailVerificationRoutingModule],
  declarations: [EmailVerificationRoutedComponents, EmailVerificationModalComponent],
  providers: [],
})
export class EmailVerificationModule {}

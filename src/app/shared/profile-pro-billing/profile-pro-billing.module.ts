import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { DeleteInfoConfirmationModalComponent } from './delete-info-confirmation-modal/delete-info-confirmation-modal.component';
import { ProfileProBillingComponent } from './profile-pro-billing.component';

@NgModule({
  imports: [CommonModule, ProfileFormModule, SpinnerModule, FormsModule, ReactiveFormsModule, ButtonModule],
  declarations: [ProfileProBillingComponent, DeleteInfoConfirmationModalComponent],
  exports: [ProfileProBillingComponent],
})
export class ProfileProBillingModule {}

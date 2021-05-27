import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { bankAccountRoutedComponents, BankAccountRoutingModule } from './bank-account.routing.module';

@NgModule({
  imports: [BankAccountRoutingModule, SpinnerModule, ReactiveFormsModule, ProfileFormModule, ButtonModule],
  declarations: [bankAccountRoutedComponents],
})
export class BankAccountModule {}

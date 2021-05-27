import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { SeparateWordByCharacterPipe } from '@shared/pipes/separate-word-by-character/separate-word-by-character.pipe';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { bankAccountRoutedComponents, BankAccountRoutingModule } from './bank-account.routing.module';

@NgModule({
  imports: [BankAccountRoutingModule, CommonModule, SpinnerModule, ReactiveFormsModule, ProfileFormModule, ButtonModule],
  declarations: [bankAccountRoutedComponents, SeparateWordByCharacterPipe],
})
export class BankAccountModule {}

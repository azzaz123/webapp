import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { SeparateWordByCharacterModule } from '@shared/pipes/separate-word-by-character/separate-word-by-character.module';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { BankAccountApiService } from '../../services/api/bank-account-api/bank-account-api.service';
import { BankAccountService } from '../../services/bank-account/bank-account.service';
import { MapBankAccountService } from '../../services/bank-account/map-bank-account/map-bank-account.service';
import { bankAccountRoutedComponents, BankAccountRoutingModule } from './bank-account.routing.module';

@NgModule({
  imports: [
    BankAccountRoutingModule,
    CommonModule,
    SpinnerModule,
    ReactiveFormsModule,
    ProfileFormModule,
    ButtonModule,
    SeparateWordByCharacterModule,
  ],
  declarations: [bankAccountRoutedComponents],
  providers: [BankAccountService, BankAccountApiService, MapBankAccountService],
})
export class BankAccountModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { NumbersOnlyDirectiveModule } from '@shared/directives/numbers-only/numbers-only.directive.module';
import { SeparateWordByCharacterModule } from '@shared/pipes/separate-word-by-character/separate-word-by-character.module';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { BankAccountApiService } from '@private/features/wallet/services/api/bank-account-api/bank-account-api.service';
import { BankAccountService } from '@private/features/wallet/services/bank-account/bank-account.service';
import { MapBankAccountService } from '@private/features/wallet/services/bank-account/map-bank-account/map-bank-account.service';
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
    NumbersOnlyDirectiveModule,
    SvgIconModule,
  ],
  declarations: [bankAccountRoutedComponents],
  exports: [bankAccountRoutedComponents],
  providers: [BankAccountService, BankAccountApiService, MapBankAccountService],
})
export class BankAccountModule {}

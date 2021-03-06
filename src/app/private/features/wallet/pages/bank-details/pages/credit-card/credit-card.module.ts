import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { NumbersOnlyDirectiveModule } from '@shared/directives/numbers-only/numbers-only.directive.module';
import { SeparateWordByCharacterModule } from '@shared/pipes/separate-word-by-character/separate-word-by-character.module';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { CreditCardComponent } from '@private/features/wallet/pages/bank-details/pages/credit-card/credit-card.component';
import { creditCardRoutedComponents, CreditCardRoutingModule } from './credit-card.routing.module';

@NgModule({
  imports: [
    CreditCardRoutingModule,
    CommonModule,
    SpinnerModule,
    ReactiveFormsModule,
    ProfileFormModule,
    ButtonModule,
    SeparateWordByCharacterModule,
    NumbersOnlyDirectiveModule,
    SvgIconModule,
  ],
  declarations: [creditCardRoutedComponents],
  exports: [CreditCardComponent],
})
export class CreditCardModule {}

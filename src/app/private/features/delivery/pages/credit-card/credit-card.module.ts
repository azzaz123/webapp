import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { NumbersOnlyDirective } from '@shared/directives/numbers-only/numbers-only.directive';
import { SeparateWordByCharacterModule } from '@shared/pipes/separate-word-by-character/separate-word-by-character.module';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
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
  ],
  declarations: [creditCardRoutedComponents, NumbersOnlyDirective],
})
export class CreditCardModule {}

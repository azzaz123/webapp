import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { creditCardRoutedComponents, CreditCardRoutingModule } from './credit-card.routing.module';

@NgModule({
  imports: [CreditCardRoutingModule, CommonModule, SpinnerModule, ReactiveFormsModule, ProfileFormModule, ButtonModule],
  declarations: [creditCardRoutedComponents],
})
export class CreditCardModule {}

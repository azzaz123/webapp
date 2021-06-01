import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { ProfileFormModule } from '@shared/profile/profile-form/profile-form.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { cardRoutedComponents, CardRoutingModule } from './card.routing.module';

@NgModule({
  imports: [CardRoutingModule, CommonModule, SpinnerModule, ReactiveFormsModule, ProfileFormModule, ButtonModule],
  declarations: [cardRoutedComponents],
})
export class CardModule {}

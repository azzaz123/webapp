import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ChangeEmailRoutedComponents, ChangeEmailRoutingModule } from './change-email.routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SvgIconModule, ButtonModule, ChangeEmailRoutingModule],
  declarations: [ChangeEmailRoutedComponents],
  providers: [],
})
export class ChangeEmailModule {}

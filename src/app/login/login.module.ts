import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { loginRoutedComponents, LoginRoutingModule } from './login.routes';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoginRoutingModule],
  declarations: [loginRoutedComponents],
})
export class LoginModule {}

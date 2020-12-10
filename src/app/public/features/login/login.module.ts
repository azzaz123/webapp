import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { loginRoutedComponents, LoginRoutingModule } from './login.routes';
import { LoginService } from './core/services/login.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoginRoutingModule],
  declarations: [loginRoutedComponents],
  providers: [LoginService],
})
export class LoginModule {}

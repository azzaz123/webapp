import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { loginRoutedComponents, LoginRoutingModule } from './login.routes';
import { LoginService } from './core/services/login.service';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, LoginRoutingModule, SharedModule],
  declarations: [loginRoutedComponents],
  providers: [LoginService],
})
export class LoginModule {}

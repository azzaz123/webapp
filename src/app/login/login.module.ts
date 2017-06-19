import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loginRoutedComponents, LoginRoutingModule } from "./login.routing";
import { LoginService } from "./login.service";
import { AlreadyLoggedGuard } from "./alreadyLogged.guard";
import { CookieService } from "angular2-cookie/core";

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule
  ],
  declarations: [loginRoutedComponents],
  providers: [
    LoginService,
    AlreadyLoggedGuard,
    CookieService
  ]
})
export class LoginModule {
}

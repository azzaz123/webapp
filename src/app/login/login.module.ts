import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'angular2-cookie/core';
import { LoggedGuard } from './logged.guard';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    LoggedGuard,
    CookieService
  ]
})
export class LoginModule {
}

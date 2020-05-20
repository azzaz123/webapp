
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { CookieModule } from 'ngx-cookie';
import { PROVIDERS } from './providers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { DndModule } from 'ng2-dnd';
import { HttpClientModule } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HttpModuleNew } from './core/http/http.module.new';
import * as Sentry from "@sentry/browser";
import { UserService } from './core/user/user.service';

Sentry.init({
  dsn: "https://6550aa8cfb064cacbb547f4928eb98a5@o391386.ingest.sentry.io/5237431"
});
@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor(public userService: UserService) {
    this.userService.me().subscribe(user => {
      Sentry.configureScope(function(scope) {
        scope.setUser({"id": user.id});
      });
    });
  }
  handleError(error) {
    Sentry.captureException(error.originalError || error);
  }
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    CoreModule.forRoot(),
    DndModule.forRoot(),
    BrowserModule,
    HttpModuleNew,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    NgxPermissionsModule.forRoot()
  ],
  providers: [PROVIDERS, { provide: ErrorHandler, useClass: SentryErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

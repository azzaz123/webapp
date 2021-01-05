import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { CookieModule } from 'ngx-cookie';
import { PROVIDERS } from './providers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HttpModuleNew } from './core/http/http.module.new';
import { ServiceWorkerModule } from '@angular/service-worker';
import { isSWEnabled } from 'environments/environment';
import { FooterModule } from '@layout/footer/footer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    CoreModule.forRoot(),
    BrowserModule,
    HttpModuleNew,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    FooterModule,
    NgxPermissionsModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: isSWEnabled,
      registrationStrategy: 'registerWithDelay:5000',
    }),
  ],
  providers: [PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}

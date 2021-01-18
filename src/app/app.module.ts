import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { PROVIDERS } from './providers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from './core/http/http.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { isSWEnabled } from 'environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: isSWEnabled,
      registrationStrategy: 'registerWithDelay:5000',
    }),
  ],
  providers: [PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}

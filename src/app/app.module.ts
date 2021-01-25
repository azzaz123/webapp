import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { isSWEnabled } from 'environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { HttpModule } from './core/http/http.module';
import { DataModule } from './data/data.module';
import { PROVIDERS } from './providers';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    BrowserModule,
    HttpModule,
    DataModule,
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

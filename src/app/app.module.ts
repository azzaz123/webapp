
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

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
    NgxPermissionsModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true })
  ],
  providers: [PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {
}

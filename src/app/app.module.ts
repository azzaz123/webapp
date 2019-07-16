import './rxjs-extensions';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { CookieModule } from 'ngx-cookie';
import { PROVIDERS } from './providers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { DndModule } from 'ng2-dnd';
import { HttpClientModule } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { HttpModuleNew } from './core/http/http.module.new';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    CoreModule.forRoot(),
    DndModule.forRoot(),
    ToastrModule.forRoot(),
    BrowserModule,
    HttpModule,
    HttpModuleNew,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    NgxPermissionsModule.forRoot()
  ],
  providers: [PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import './rxjs-extensions';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app.routing';
import { LoginModule } from './login/login.module';
import { CoreModule } from './core/core.module';
import { CookieModule } from 'ngx-cookie';
import { PROVIDERS } from './providers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { CatalogModule } from './catalog/catalog.module';
import { DndModule } from 'ng2-dnd';
import { HttpClientModule } from '@angular/common/http';
import { TutorialModule } from './tutorial/tutorial.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { WallacoinsModule } from './wallacoins/wallacoins.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ChatModule,
    CookieModule.forRoot(),
    CoreModule.forRoot(),
    DndModule.forRoot(),
    ToastrModule.forRoot(),
    BrowserModule,
    LoginModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    CatalogModule,
    TutorialModule,
    NgxPermissionsModule.forRoot(),
    WallacoinsModule
  ],
  providers: [PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import './rxjs-extensions';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ShieldModule } from 'shield';
import { ChatModule } from './chat/chat.module';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app.routing';
import { LoginModule } from './login/login.module';
import { CoreModule } from './core/core.module';
import { CookieModule } from 'ngx-cookie';
import { PROVIDERS } from './providers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ShieldModule.forRoot(),
    BrowserAnimationsModule,
    ChatModule,
    CookieModule.forRoot(),
    CoreModule.forRoot(),
    BrowserModule,
    LoginModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {
}

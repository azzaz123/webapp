import './rxjs-extensions';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ShieldModule, WindowRef } from 'shield';
import { ChatModule } from './chat/chat.module';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app.routing';
import { LoginModule } from './login/login.module';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ShieldModule.forRoot(),
    BrowserAnimationsModule,
    ChatModule,
    BrowserModule,
    LoginModule,
    HttpModule,
    AppRoutingModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

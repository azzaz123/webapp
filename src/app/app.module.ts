import './rxjs-extensions';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ShieldModule } from 'shield';
import { ChatModule } from './chat/chat.module';
import { providers } from './app.providers';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports:      [
    BrowserModule,
    ShieldModule,
    ChatModule
  ],
  providers:    [
    ...providers(),
  ],
  bootstrap:    [AppComponent]
})
export class AppModule {
}

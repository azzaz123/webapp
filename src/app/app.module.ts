import './rxjs-extensions';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ShieldModule, WindowRef } from 'shield';
import { ChatModule } from './chat/chat.module';

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
    WindowRef
  ],
  bootstrap:    [AppComponent]
})
export class AppModule {
}

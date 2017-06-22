import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ShieldModule } from 'shield';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app.routing';
import { WindowRef } from './core/window/window.service';
import { LoginModule } from './login/login.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ShieldModule,
    BrowserModule,
    LoginModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [WindowRef],
  bootstrap: [AppComponent]
})
export class AppModule {
}

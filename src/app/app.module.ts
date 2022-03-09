import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { HttpModule } from './core/http/http.module';
import { PROVIDERS } from './providers';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserAnimationsModule, CoreModule, BrowserModule, HttpModule, AppRoutingModule],
  providers: [PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}

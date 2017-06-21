import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ShieldModule } from 'shield';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
      BrowserModule,
      ShieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

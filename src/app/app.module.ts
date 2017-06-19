import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { LoginModule } from "./login/login.module";
import { HttpModule } from '@angular/http';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports:      [
        BrowserModule,
        LoginModule,
        HttpModule
    ],
    providers:    [],
    bootstrap:    [AppComponent]
})
export class AppModule {
}

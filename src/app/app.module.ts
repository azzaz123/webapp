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
import { FavoritesModule } from './favorites/favorites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProfileModule } from './profile/profile.module';
import { HttpClientModule } from '@angular/common/http';
import { TutorialModule } from './tutorial/tutorial.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CallsModule } from './calls/calls.module';

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
    BrowserModule,
    LoginModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    CatalogModule,
    ReviewsModule,
    FavoritesModule,
    ProfileModule,
    TutorialModule,
    NgxPermissionsModule.forRoot(),
    CallsModule
  ],
  providers: [PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {
}

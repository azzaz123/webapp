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
import { LayoutModule } from './layout/layout.module';
import { environment } from '../environments/environment';
import { CatalogModule } from './catalog/catalog.module';
import { DndModule } from 'ng2-dnd';
import { FavoritesModule } from './favorites/favorites.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ShieldModule.forRoot({
      cacheAllConversations: false,
      environment: environment,
      addSignature: true,
      conversationIdName: 'conversation_id',
      conversationUserId: 'other_user_id'
    }),
    BrowserAnimationsModule,
    ChatModule,
    CookieModule.forRoot(),
    CoreModule.forRoot(),
    DndModule.forRoot(),
    BrowserModule,
    LoginModule,
    HttpModule,
    AppRoutingModule,
    LayoutModule,
    CatalogModule,
    FavoritesModule,
    ProfileModule
  ],
  providers: [PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {
}

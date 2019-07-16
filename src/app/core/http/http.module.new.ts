import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from 'ngx-cookie';

import { HttpServiceNew } from './http.service.new';
import { TokenInterceptor } from './interceptors';
import { AccessTokenService } from './access-token.service';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CookieModule.forChild(),
    ],
    providers: [
        HttpServiceNew,
        AccessTokenService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        }
    ]
})

export class HttpModuleNew { }

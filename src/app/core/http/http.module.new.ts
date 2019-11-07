import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieModule } from 'ngx-cookie';

import { HttpServiceNew } from './http.service.new';
import { TokenInterceptor, MockInterceptor } from './interceptors';
import { AccessTokenService } from './access-token.service';

@NgModule({
    imports: [
        HttpClientModule,
        CookieModule.forChild(),
    ],
    providers: [
        HttpServiceNew,
        AccessTokenService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MockInterceptor,
            multi: true
        }
    ]
})

export class HttpModuleNew { }

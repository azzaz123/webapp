import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieModule } from 'ngx-cookie';

import { TokenInterceptor, MockInterceptor, NullQueryParamsInterceptor } from './interceptors';
import { AccessTokenService } from './access-token.service';

@NgModule({
    imports: [
        HttpClientModule,
        CookieModule.forChild(),
    ],
    providers: [
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
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NullQueryParamsInterceptor,
            multi: true
        }
    ]
})

export class HttpModuleNew { }

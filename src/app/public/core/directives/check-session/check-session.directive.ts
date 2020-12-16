import { Directive, HostListener } from '@angular/core';
import { AccessTokenService } from '@core/http/access-token.service';
import { PublicWebUrlService } from '@public/core/services/public-web-url/public-web-url.service';

@Directive({
  selector: '[tslCheckSession]',
})
export class CheckSessionDirective {
  constructor(
    private accessTokenService: AccessTokenService,
    private publicWebUrlService: PublicWebUrlService
  ) {}

  @HostListener('click') onClick() {
    if (!this.accessTokenService.accessToken) {
      window.location.assign(this.publicWebUrlService.getLoginUrl());
    }
  }
}

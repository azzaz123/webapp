import { Injectable } from '@angular/core';
import { AccessTokenService } from '@core/http/access-token.service';
import { PublicWebUrlService } from '../public-web-url/public-web-url.service';

@Injectable()
export class CheckSessionService {
  constructor(
    private accessTokenService: AccessTokenService,
    private publicWebUrlService: PublicWebUrlService
  ) {}

  public checkSessionAction(): void {
    if (!this.accessTokenService.accessToken) {
      window.location.assign(this.publicWebUrlService.getLoginUrl());
    }
  }
}

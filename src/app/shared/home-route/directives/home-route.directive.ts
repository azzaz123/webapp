import { HostListener, Directive, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SITE_URL } from '@configs/site-url.config';
import { StandaloneService } from '@core/standalone/services/standalone.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';

@Directive({
  selector: '[tslHomeRoute]',
})
export class HomeRouteDirective {
  constructor(
    private router: Router,
    private standaloneService: StandaloneService,
    @Inject(WINDOW_TOKEN) private window,
    @Inject(SITE_URL) private siteUrl: string
  ) {}

  @HostListener('click') onClick(): void {
    if (this.standaloneService.standalone) {
      this.router.navigate([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.SEARCH}`]);
    } else {
      this.window.open(this.siteUrl, '_self');
    }
  }
}

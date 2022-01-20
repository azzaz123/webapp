import { HostListener, Directive, Inject } from '@angular/core';
import { SITE_URL } from '@configs/site-url.config';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { StandaloneService } from '@core/standalone/services/standalone.service';
import { WINDOW_TOKEN } from '@core/window/window.token';

@Directive({
  selector: '[tslHomeRoute]',
})
export class HomeRouteDirective {
  constructor(
    private standaloneService: StandaloneService,
    private searchNavigatorService: SearchNavigatorService,
    @Inject(WINDOW_TOKEN) private window,
    @Inject(SITE_URL) private siteUrl: string
  ) {}

  @HostListener('click') onClick(): void {
    if (this.standaloneService.standalone) {
      this.searchNavigatorService.navigateWithLocationParams({});
    } else {
      this.window.open(this.siteUrl, '_self');
    }
  }
}

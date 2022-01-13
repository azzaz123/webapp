import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { Directive, Input, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SITE_URL } from '@configs/site-url.config';
import { StandaloneService } from '@core/standalone/services/standalone.service';
import { WINDOW_TOKEN } from '@core/window/window.token';

@Directive({
  selector: '[tslItemRoute]',
})
export class ItemRouteDirective {
  @Input() itemSlug: string;
  @Input() itemUUID: string;

  constructor(
    private router: Router,
    private standaloneService: StandaloneService,
    @Inject(WINDOW_TOKEN) private window,
    @Inject(SITE_URL) private siteUrl: string
  ) {}

  @HostListener('click') onClick(): void {
    if (this.standaloneService.standalone) {
      this.router.navigate([`${PUBLIC_PATHS.ITEM_DETAIL}/${this.itemUUID}`]);
    } else {
      this.window.open(`${this.siteUrl}${PUBLIC_PATHS.ITEM_DETAIL}/${this.itemSlug}`);
    }
  }
}

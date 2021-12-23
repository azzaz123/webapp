import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { Directive, Input, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SITE_URL } from '@configs/site-url.config';
import { StandaloneService } from '@core/standalone/services/standalone.service';

@Directive({
  selector: '[tslItemRoute]',
})
export class ItemRouteDirective {
  @Input() itemSlug: string;
  @Input() itemUUID: string;

  constructor(private router: Router, private standaloneService: StandaloneService, @Inject(SITE_URL) private siteUrl: string) {}

  @HostListener('click') onClick() {
    this.standaloneService.standalone$.subscribe((standaloneMode) => {
      if (standaloneMode) {
        this.router.navigate([`${PUBLIC_PATHS.ITEM_DETAIL}/${this.itemUUID}`]);
      } else {
        window.open(`${this.siteUrl}${PUBLIC_PATHS.ITEM_DETAIL}/${this.itemSlug}`);
      }
    });
  }
}

import { Inject, Pipe, PipeTransform } from '@angular/core';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { SITE_URL } from 'configs/site-url.config';

@Pipe({
  name: 'itemDetailRoute',
})
export class ItemDetailRoutePipe implements PipeTransform {
  constructor(@Inject(SITE_URL) private siteUrl: string) {}

  transform(itemSlug: string): string {
    return `${this.siteUrl}${PUBLIC_PATHS.ITEM_DETAIL}/${itemSlug}`;
  }
}

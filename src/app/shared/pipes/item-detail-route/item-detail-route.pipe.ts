import { Inject, Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environments/environment';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';

@Pipe({
  name: 'itemDetailRoute',
})
export class ItemDetailRoutePipe implements PipeTransform {
  constructor(@Inject('SUBDOMAIN') private subdomain: string) {}

  transform(itemSlug: string): string {
    return `${environment.siteUrl.replace('es', this.subdomain)}${PUBLIC_PATHS.ITEM_DETAIL}/${itemSlug}`;
  }
}

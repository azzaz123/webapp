import { Pipe, PipeTransform } from '@angular/core';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';
import { WebSlugConverterPipe } from '../web-slug-converter';

@Pipe({
  name: 'userProfileRoute',
})
export class UserProfileRoutePipe extends WebSlugConverterPipe implements PipeTransform {
  constructor() {
    super();
  }

  transform(webSlug: string, hashId: string): string {
    const slug = super.transform(webSlug, hashId);

    return !!APP_PATHS.PUBLIC ? `/${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.USER_DETAIL}/${slug}` : `/${PUBLIC_PATHS.USER_DETAIL}/${slug}`;
  }
}

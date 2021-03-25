import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'webSlugConverter',
})
export class WebSlugConverterPipe implements PipeTransform {
  transform(webSlug: string, hashId: string): string {
    const lastDash = webSlug.lastIndexOf('-');
    const name = webSlug.substring(0, lastDash);
    const id = webSlug.substring(lastDash + 1);

    if (Number.isInteger(parseInt(id))) {
      return `${name}-${hashId}`;
    } else {
      return webSlug;
    }
  }
}

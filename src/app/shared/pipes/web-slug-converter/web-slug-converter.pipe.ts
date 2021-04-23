import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'webSlugConverter',
})
export class WebSlugConverterPipe implements PipeTransform {
  transform(webSlug: string, hashId: string): string {
    const id = webSlug?.split('-').pop();
    const numericId = Number(id);

    if (!id && hashId) {
      return webSlug + hashId;
    }
    if (!numericId || isNaN(numericId)) {
      return webSlug;
    }
    return webSlug.replace(id, hashId);
  }
}

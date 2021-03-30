import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SlugsUtilService {
  public getUUIDfromSlug(webSlug: string): string {
    const UUID = webSlug?.split('-').pop();

    if (UUID) {
      return UUID;
    }
    return webSlug;
  }
}

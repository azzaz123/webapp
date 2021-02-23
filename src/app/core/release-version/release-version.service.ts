import { Injectable } from '@angular/core';
import { APP_VERSION } from '@environments/version';

@Injectable({
  providedIn: 'root',
})
export class ReleaseVersionService {
  constructor() {}

  get releaseVersion(): string {
    return APP_VERSION.split('.')
      .map((subVersion, index) => {
        if (index !== 0) {
          return subVersion.padStart(3, '0');
        }
        return subVersion;
      })
      .join('');
  }
}

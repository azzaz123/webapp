import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReleaseVersionService {
  constructor() {}

  public getReleaseVersion(appVersion: string): string {
    return appVersion
      .split('.')
      .map((subVersion, index) => {
        if (index !== 0) {
          return subVersion.padStart(3, '0');
        }
        return subVersion;
      })
      .join('');
  }
}

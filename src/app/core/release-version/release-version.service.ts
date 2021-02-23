import { Injectable } from '@angular/core';
import { APP_VERSION } from '@environments/version';

@Injectable({
  providedIn: 'root',
})
export class ReleaseVersionService {
  constructor() {}

  get releaseVersion(): string {
    return APP_VERSION.split('.')
      .map((subVersion: string) => ('00' + subVersion).slice(-3))
      .reduce((a: string, b: string) => parseInt(a) + b);
  }
}

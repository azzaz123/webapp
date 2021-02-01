import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { AdsService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AdsResolver implements Resolve<void> {
  constructor(private adsService: AdsService) {}

  resolve(): void {
    this.adsService.init();
  }
}

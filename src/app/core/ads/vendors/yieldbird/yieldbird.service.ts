import { Injectable } from '@angular/core';
import { AdTargetings } from '@core/ads/models/ad-targetings';

@Injectable({
  providedIn: 'root',
})
export class YieldBirdService {
  constructor() {}

  get targetings(): AdTargetings {
    let _YB = {
      ab: () => (_YB.dool ? 'b' : 'a' + Math.floor(Math.random() * 10)),
      dool: Math.random() >= 0.1,
    };

    let yb_ab;

    if (Math.random() <= 0.9) {
      yb_ab = _YB.ab();
    } else {
      yb_ab = 'c';
    }

    return { yb_ab };
  }
}

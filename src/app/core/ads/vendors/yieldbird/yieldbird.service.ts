import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@core/window/window.token';

@Injectable({
  providedIn: 'root',
})
export class YieldBirdService {
  constructor(@Inject(WINDOW_TOKEN) private window: Window) {}

  public init(): void {
    this.googletag.cmd.push(() => {
      var _YB = _YB || {
        ab: () => {
          return _YB.dool ? 'b' : 'a' + Math.floor(Math.random() * 10);
        },
        dool: Math.random() >= 0.1,
      };

      var yb_ab;
      if (Math.random() <= 0.9) {
        yb_ab = _YB.ab();
      } else {
        yb_ab = 'c';
      }

      this.googletag.pubads().setTargeting('yb_ab', yb_ab);
    });
  }

  get googletag(): googletag.Googletag {
    return this.window['googletag'] || { cmd: [], apiReady: false };
  }
}

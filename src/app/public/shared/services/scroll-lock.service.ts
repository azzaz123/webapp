import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@core/window/window.token';

// TODO: Need to test in different environments. This is just a placeholder
//       Will be fully implemented in https://wallapop.atlassian.net/browse/WEB-350
@Injectable()
export class ScrollLockService {
  constructor(@Inject(WINDOW_TOKEN) private window: Window) {}

  public changeLockStatus(locked: boolean): void {
    const bodyStyle = this.window.document.body.style;
    if (locked) {
      bodyStyle.overflow = 'hidden';
    } else {
      bodyStyle.overflow = 'unset';
    }
  }

  public lock(): void {
    this.changeLockStatus(true);
  }

  public unlock(): void {
    this.changeLockStatus(false);
  }
}

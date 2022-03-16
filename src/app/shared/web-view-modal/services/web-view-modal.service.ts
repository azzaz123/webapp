import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { Observable, ReplaySubject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebViewModalService {
  private childWindowRef: Window;

  constructor(@Inject(WINDOW_TOKEN) private window: Window) {}

  public open(url: string): Observable<void> {
    this.childWindowRef = this.openNewWindowAsModal(url);
    return this.checkWindowRefClosed();
  }

  // TODO: This will be replaced in the future by opening a component as a modal with an iframe inside ("WebViewModalComponent", coming soon tm)
  private openNewWindowAsModal(url: string): Window {
    const modalWidth: number = 375;
    const modalHeight: number = 640;

    const dualScreenLeft = this.window.screenLeft !== undefined ? this.window.screenLeft : this.window.screenX;
    const dualScreenTop = this.window.screenTop !== undefined ? this.window.screenTop : this.window.screenY;

    const width = this.window.innerWidth
      ? this.window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
    const height = this.window.innerHeight
      ? this.window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

    const systemZoom = width / this.window.screen.availWidth;
    const left = (width - modalWidth) / 2 / systemZoom + dualScreenLeft;
    const top = (height - modalHeight) / 2 / systemZoom + dualScreenTop;

    const variableWindowOptions: string = [`width=${modalWidth}`, `height=${modalHeight}`, `top=${top}`, `left=${left}`].join(',');

    const fixedWindowOptions: string = [
      'fullscreen=0',
      'menubar=0',
      'toolbar=0',
      'status=0',
      'resizable=1',
      'location=0',
      'directories=0',
      'scrollbars=1',
      'copyhistory=0',
    ].join(',');

    const windowOptions: string = variableWindowOptions.concat(fixedWindowOptions);

    const newWindow: Window = this.window.open(url, '', windowOptions);

    if (this.window.focus) {
      newWindow.focus();
    }
    return newWindow;
  }

  //TODO: Will be also removed when including web view modal component
  private checkWindowRefClosed(): Observable<void> {
    const windowRefWasClosed: ReplaySubject<void> = new ReplaySubject<void>(1);

    timer(0, 1000)
      .pipe(
        tap(() => {
          try {
            if (this.childWindowRef.closed) {
              windowRefWasClosed.next();
            }
          } catch {
            windowRefWasClosed.next();
          }
        }),
        takeUntil(windowRefWasClosed)
      )
      .subscribe();

    return windowRefWasClosed.asObservable();
  }
}

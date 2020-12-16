import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from '@environments/environment';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  public newSession$: ReplaySubject<void> = new ReplaySubject<void>();

  private static SESSION_COOKIE_NAME = 'wallapop_keep_session';
  private static SESSION_TRACK_INTERVAL = 60000;
  private static SESSION_TIMEOUT = 15 * 60000;

  constructor(private cookieService: CookieService) {
    const isNewSession =
      this.cookieService.get(SessionService.SESSION_COOKIE_NAME) !== 'true';
    this.initSessionTracking();
    if (isNewSession) {
      this.newSession$.next();
    }
  }

  private initSessionTracking() {
    const boundPutSessionCookie = this.putSessionCookie.bind(this);
    this.putSessionCookie();
    setInterval(boundPutSessionCookie, SessionService.SESSION_TRACK_INTERVAL);
    // window.onunload = boundPutSessionCookie;
  }

  private putSessionCookie() {
    this.cookieService.put(SessionService.SESSION_COOKIE_NAME, 'true', {
      expires: new Date(new Date().getTime() + SessionService.SESSION_TIMEOUT),
      // TODO: Generic cookie options could be abstracted and extended on each case
      domain: environment.name === 'local' ? 'localhost' : '.wallapop.com',
      path: '/',
    });
  }
}

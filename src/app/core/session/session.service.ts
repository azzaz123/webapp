import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private static SESSION_COOKIE_NAME = 'wallapop_keep_session';
  private static SESSION_TRACK_INTERVAL = 60000;
  private static SESSION_TIMEOUT = 15 * 60000;
  private _newSession$: ReplaySubject<void> = new ReplaySubject<void>();

  constructor(private cookieService: CookieService) {}

  public get newSession$(): Observable<void> {
    return this._newSession$.asObservable();
  }

  public initSession(): void {
    const isNewSession = this.cookieService.get(SessionService.SESSION_COOKIE_NAME) !== 'true';
    this.initSessionTracking();
    if (isNewSession) {
      this._newSession$.next();
    }
  }

  private initSessionTracking(): void {
    const boundPutSessionCookie = this.putSessionCookie.bind(this);
    this.putSessionCookie();
    setInterval(boundPutSessionCookie, SessionService.SESSION_TRACK_INTERVAL);
    window.onunload = boundPutSessionCookie;
  }

  private putSessionCookie(): void {
    this.cookieService.put(SessionService.SESSION_COOKIE_NAME, 'true', {
      expires: new Date(new Date().getTime() + SessionService.SESSION_TIMEOUT),
      // TODO: Generic cookie options could be abstracted and extended on each case
      domain: environment.name === 'local' ? 'localhost' : '.wallapop.com',
      path: '/',
    });
  }
}

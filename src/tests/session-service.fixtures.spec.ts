import { Observable, ReplaySubject } from 'rxjs';

export class MockSessionService {
  private _newSession$: ReplaySubject<void> = new ReplaySubject<void>();
  public get newSession$(): Observable<void> {
    return this._newSession$.asObservable();
  }

  initSession() {
    this._newSession$.next();
  }
}

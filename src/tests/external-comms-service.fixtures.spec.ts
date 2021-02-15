import { Observable, ReplaySubject } from 'rxjs';

export class MockExternalCommsService {
  private _brazeReady$: ReplaySubject<void> = new ReplaySubject<void>();
  public get brazeReady$(): Observable<void> {
    return this._brazeReady$.asObservable();
  }
  initializeBrazeCommunications() {
    this._brazeReady$.next();
  }
}

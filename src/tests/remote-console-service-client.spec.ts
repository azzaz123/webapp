import { Observable, of } from 'rxjs';

export class RemoteConsoleClientServiceMock {
  public info(message: {}): Observable<any> {
    return of({});
  }
}
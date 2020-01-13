import { Observable, of } from 'rxjs';

export class RemoteConsoleClientServiceMock {
  public infoLog(message: {}): Observable<any> {
    return of({});
  }
}

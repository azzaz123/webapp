import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';

@Injectable()
export class RemoteConsoleClientService {
  constructor(private http: HttpClient) {}

  public info(message: {}): void {
    this.generateRemoteConsoleRequest(message).subscribe();
  }

  public info$(message: {}): Observable<void> {
    return this.generateRemoteConsoleRequest(message);
  }

  // TODO: Remove the development flag when beta/docker metrics environment work as expected
  private generateRemoteConsoleRequest(message: Object): Observable<void> {
    const isDevelopment = !environment.production;
    if (isDevelopment) {
      return of(null);
    }
    return this.http.post<void>(environment.remoteConsoleUrl, { logs: [message] });
  }
}

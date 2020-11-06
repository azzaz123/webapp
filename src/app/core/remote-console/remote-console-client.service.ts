import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RemoteConsoleClientService {
  constructor(private http: HttpClient) {}

  public info(message: {}): void {
    this.http
      .post(environment.remoteConsoleUrl, { logs: [message] })
      .subscribe();
  }

  public info$(message: {}): Observable<any> {
    return this.http.post(environment.remoteConsoleUrl, { logs: [message] });
  }
}

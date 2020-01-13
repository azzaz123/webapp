import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoteConsoleClientService {

  constructor(private httpClient: HttpClient) {
  }

  public infoLog(message: {}): Observable<any> {
    return this.httpClient.post(environment.remoteConsoleUrl, { logs: [message] });
  }
}

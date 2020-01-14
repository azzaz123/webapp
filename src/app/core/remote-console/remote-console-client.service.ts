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

  public info(message: {}): void {
    this.httpClient.post(environment.remoteConsoleUrl, { logs: [message] }).subscribe();
  }
}

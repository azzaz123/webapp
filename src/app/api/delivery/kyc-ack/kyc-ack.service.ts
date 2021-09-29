import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KYCAckHttpService } from './http/kyc-ack-http.service';

@Injectable()
export class KYCAckService {
  constructor(private kycAckHttpService: KYCAckHttpService) {}

  public notify(): Observable<Object> {
    return this.kycAckHttpService.notify();
  }
}

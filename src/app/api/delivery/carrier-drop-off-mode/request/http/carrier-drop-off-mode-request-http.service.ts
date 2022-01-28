import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarrierDropOffModeRequestDto } from '../dtos/carrier-drop-off-mode-request-dto.interface';
import { CARRIER_DROP_OFF_MODE_REQUEST_WITH_REQUEST_ID } from './endpoints';
import { APP_VERSION } from '@environments/version';

@Injectable({
  providedIn: 'root',
})
export class CarrierDropOffModeRequestHttpService {
  constructor(private http: HttpClient) {}

  public get(requestId: string): Observable<CarrierDropOffModeRequestDto> {
    return this.http.get<CarrierDropOffModeRequestDto>(CARRIER_DROP_OFF_MODE_REQUEST_WITH_REQUEST_ID(requestId), {
      headers: { 'X-AppVersion': APP_VERSION.replace(/\./g, '') },
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarrierDto } from '@api/delivery/carrier-drop-off-mode/request/dtos/carrier-drop-off-mode-request-dto.interface';
import { Observable } from 'rxjs';
import { CarrierOfficeAdressesDto } from '../dtos/responses/carrier-office-adresses-dto.interface';
import { CARRIER_OFFICE_ADDRESSES_URL } from './endpoints';

@Injectable({
  providedIn: 'root',
})
export class CarrierOfficesHttpService {
  constructor(private http: HttpClient) {}

  public getCarrierOfficeAddresses(
    latitude: number,
    longitude: number,
    radiusKm: number,
    carrier: CarrierDto
  ): Observable<CarrierOfficeAdressesDto> {
    return this.http.get<CarrierOfficeAdressesDto>(CARRIER_OFFICE_ADDRESSES_URL, {
      params: {
        latitude,
        longitude,
        radiusKm,
        carrier,
      },
    });
  }
}

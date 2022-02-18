import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarrierDto } from '@api/bff/delivery/carrier-offices/dtos/responses/carrier-office-addresses-dto.interface';
import { Observable } from 'rxjs';
import { CarrierOfficeAddressesDto } from '../dtos/responses/carrier-office-addresses-dto.interface';
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
  ): Observable<CarrierOfficeAddressesDto> {
    return this.http.get<CarrierOfficeAddressesDto>(CARRIER_OFFICE_ADDRESSES_URL, {
      params: {
        latitude,
        longitude,
        radiusKm,
        carrier,
      },
    });
  }
}

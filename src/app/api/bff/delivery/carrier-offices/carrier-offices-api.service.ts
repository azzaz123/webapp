import { Injectable } from '@angular/core';
import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarrierOfficesHttpService } from './http/carrier-offices-http.service';
import { mapCarrierDomainToDto } from './mappers/requests/carrier-offices.mapper';
import { mapCarrierOfficeAddressesDtoToCarrierOfficeInfo } from './mappers/responses/carrier-office-info.mapper';
import { LocationWithRadius } from '@api/core/model/location/location';

@Injectable({
  providedIn: 'root',
})
export class CarrierOfficesApiService {
  constructor(private carrierOfficesHttpService: CarrierOfficesHttpService) {}

  public getCarrierOfficeAddresses(locationWithRadius: LocationWithRadius, carrier: POST_OFFICE_CARRIER): Observable<CarrierOfficeInfo[]> {
    return this.carrierOfficesHttpService
      .getCarrierOfficeAddresses(
        locationWithRadius.latitude,
        locationWithRadius.longitude,
        locationWithRadius.radiusInKm,
        mapCarrierDomainToDto[carrier]
      )
      .pipe(map(mapCarrierOfficeAddressesDtoToCarrierOfficeInfo));
  }
}

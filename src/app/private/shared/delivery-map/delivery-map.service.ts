import { Injectable } from '@angular/core';
import { CarrierOfficesApiService } from '@api/bff/delivery/carrier-offices/carrier-offices-api.service';
import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { CarrierOfficeAddressesApiService } from '@api/delivery/me/carrier-office-addresses/carrier-office-addresses-api.service';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeliveryMapService {
  private offices$: ReplaySubject<any> = new ReplaySubject(1);

  constructor(
    private carrierOfficeAddressesApiService: CarrierOfficeAddressesApiService,
    private carrierOfficesApiService: CarrierOfficesApiService
  ) {}

  public getOffices(latitude: number, longitude: number, radiusKm: number, carrier: POST_OFFICE_CARRIER): Observable<CarrierOfficeInfo[]> {
    return this.carrierOfficesApiService
      .getCarrierOfficeAddresses(latitude, longitude, radiusKm, carrier)
      .pipe(tap((offices: CarrierOfficeInfo[]) => (this.offices = offices)));
  }

  public selectOffice(carrierOfficeInfo: CarrierOfficeInfo, officeId: string = null): Observable<void> {
    if (officeId) {
      return this.carrierOfficeAddressesApiService.createSelectedCarrierOffice(carrierOfficeInfo);
    }
    return this.carrierOfficeAddressesApiService.updateSelectedCarrierOffice(officeId, carrierOfficeInfo);
  }

  private getInitialCoordinates() {}

  private set offices(newOffices: CarrierOfficeInfo[]) {
    this.offices$.next(newOffices);
  }
}

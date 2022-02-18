import { Injectable } from '@angular/core';
import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { Observable } from 'rxjs';
import { CarrierOfficeAddressesHttpService } from './http/carrier-office-addresses-http.service';
import { mapCarrierOfficeInfoToSelectedCarrierOfficeDto } from './mappers/requests/selected-carrier-office.mapper';

@Injectable({
  providedIn: 'root',
})
export class CarrierOfficeAddressesApiService {
  constructor(private carrierOfficeAddressesHttpService: CarrierOfficeAddressesHttpService, private uuidService: UuidService) {}

  public createSelectedCarrierOffice(selectedOffice: CarrierOfficeInfo): Observable<void> {
    const userCarrierOfficeId: string = this.uuidService.getUUID();
    return this.carrierOfficeAddressesHttpService.createSelectedCarrierOffice(
      mapCarrierOfficeInfoToSelectedCarrierOfficeDto(userCarrierOfficeId, selectedOffice)
    );
  }

  public updateSelectedCarrierOffice(officeId: string, selectedOffice: CarrierOfficeInfo): Observable<void> {
    return this.carrierOfficeAddressesHttpService.updateSelectedCarrierOffice(
      officeId,
      mapCarrierOfficeInfoToSelectedCarrierOfficeDto(officeId, selectedOffice)
    );
  }
}

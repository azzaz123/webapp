import { Injectable } from '@angular/core';
import { SelectedCarrierOffice } from '@api/core/model/delivery/selected-carrier-office/selected-carrier-office.interface';
import { Observable } from 'rxjs';
import { CarrierOfficeAddressesHttpService } from './http/carrier-office-addresses-http.service';
import { mapSelectedCarrierOfficeToSelectedCarrierOfficeDto } from './mappers/requests/selected-carrier-office.mapper';

@Injectable({
  providedIn: 'root',
})
export class CarrierOfficeAddressesApiService {
  constructor(private carrierOfficeAddressesHttpService: CarrierOfficeAddressesHttpService) {}

  public createSelectedCarrierOffice(selectedOffice: SelectedCarrierOffice): Observable<void> {
    return this.carrierOfficeAddressesHttpService.createSelectedCarrierOffice(
      mapSelectedCarrierOfficeToSelectedCarrierOfficeDto(selectedOffice)
    );
  }

  public updateSelectedCarrierOffice(carrierId: string, selectedOffice: SelectedCarrierOffice): Observable<void> {
    return this.carrierOfficeAddressesHttpService.updateSelectedCarrierOffice(
      carrierId,
      mapSelectedCarrierOfficeToSelectedCarrierOfficeDto(selectedOffice)
    );
  }
}

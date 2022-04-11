import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectedCarrierOfficeDto } from '../dtos/requests/selected-carrier-office-dto.interface';
import { CREATE_SELECTED_CARRIER_OFFICE_ENDPOINT, UPDATE_SELECTED_CARRIER_OFFICE_ENDPOINT } from './endpoints';

@Injectable({
  providedIn: 'root',
})
export class CarrierOfficeAddressesHttpService {
  constructor(private http: HttpClient) {}

  public createSelectedCarrierOffice(selectedOffice: SelectedCarrierOfficeDto): Observable<void> {
    return this.http.post<void>(CREATE_SELECTED_CARRIER_OFFICE_ENDPOINT, { ...selectedOffice });
  }

  public updateSelectedCarrierOffice(officeId: string, selectedOffice: SelectedCarrierOfficeDto): Observable<void> {
    return this.http.put<void>(UPDATE_SELECTED_CARRIER_OFFICE_ENDPOINT(officeId), { ...selectedOffice });
  }
}

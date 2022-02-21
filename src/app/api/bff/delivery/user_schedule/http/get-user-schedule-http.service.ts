import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryScheduleDto } from '../dtos/responses/delivery-schedule-dto.interface';
import { GET_DELIVERY_SCHEDULES_ENDPOINT } from './endpoints';

@Injectable({
  providedIn: 'root',
})
export class GetUserScheduleHttpService {
  constructor(private http: HttpClient) {}

  public homePickUpDeliverySchedules(): Observable<DeliveryScheduleDto> {
    return this.http.get<DeliveryScheduleDto>(GET_DELIVERY_SCHEDULES_ENDPOINT);
  }
}

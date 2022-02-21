import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleTypeDto } from '../dtos/requests/schedule-type-dto.type';
import { UPDATE_DELIVERY_USER_SCHEDULE_ENDPOINT } from './endpoints';

@Injectable({
  providedIn: 'root',
})
export class UserScheduleHttpService {
  constructor(private http: HttpClient) {}

  public selectHomePickUpDeliverySchedule(scheduleId: string, scheduleType: ScheduleTypeDto): Observable<void> {
    return this.http.put<void>(UPDATE_DELIVERY_USER_SCHEDULE_ENDPOINT, {
      id: scheduleId,
      schedule_time_range: scheduleType,
    });
  }
}

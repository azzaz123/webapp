import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleTypeDto } from '../dtos/requests/schedule-type-dto.type';
import { SELECT_DELIVERY_USER_SCHEDULE_ENDPOINT } from './endpoints';

@Injectable({
  providedIn: 'root',
})
export class SelectUserScheduleHttpService {
  constructor(private http: HttpClient) {}

  public homePickUpDeliverySchedule(scheduleId: string, scheduleType: ScheduleTypeDto): Observable<void> {
    return this.http.put<void>(SELECT_DELIVERY_USER_SCHEDULE_ENDPOINT, {
      id: scheduleId,
      schedule_time_range: scheduleType,
    });
  }
}

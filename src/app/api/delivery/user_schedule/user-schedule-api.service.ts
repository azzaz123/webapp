import { Injectable } from '@angular/core';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { Observable } from 'rxjs';
import { UserScheduleHttpService } from './http/user-schedule-http.service';
import { mapScheduleTypeDomainToDto } from './mappers/requests/schedule-type.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserScheduleApiService {
  constructor(private userScheduleHttpService: UserScheduleHttpService) {}

  public selectHomePickUpDeliverySchedule(scheduleId: string, scheduleType: SCHEDULE_TYPE): Observable<void> {
    return this.userScheduleHttpService.selectHomePickUpDeliverySchedule(scheduleId, mapScheduleTypeDomainToDto[scheduleType]);
  }
}

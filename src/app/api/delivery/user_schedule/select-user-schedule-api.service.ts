import { Injectable } from '@angular/core';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { Observable } from 'rxjs';
import { SelectUserScheduleHttpService } from './http/select-user-schedule-http.service';
import { mapScheduleTypeDomainToDto } from './mappers/requests/schedule-type.mapper';

@Injectable({
  providedIn: 'root',
})
export class SelectUserScheduleApiService {
  constructor(private selectUserScheduleHttpService: SelectUserScheduleHttpService) {}

  public homePickUpDeliverySchedule(scheduleId: string, scheduleType: SCHEDULE_TYPE): Observable<void> {
    return this.selectUserScheduleHttpService.homePickUpDeliverySchedule(scheduleId, mapScheduleTypeDomainToDto[scheduleType]);
  }
}

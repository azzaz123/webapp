import { Injectable } from '@angular/core';
import { DeliverySchedule } from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetUserScheduleHttpService } from './http/get-user-schedule-http.service';
import { mapUserScheduleDtoUserSchedule } from './mappers/user-schedule.mapper';

@Injectable({
  providedIn: 'root',
})
export class GetUserScheduleApiService {
  constructor(private getUserScheduleHttpService: GetUserScheduleHttpService) {}

  public homePickUpDeliverySchedules(): Observable<DeliverySchedule> {
    return this.getUserScheduleHttpService.homePickUpDeliverySchedules().pipe(map(mapUserScheduleDtoUserSchedule));
  }
}

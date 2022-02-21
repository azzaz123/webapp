import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserScheduleHttpService } from './http/user-schedule-http.service';
import { mapUserScheduleDtoUserSchedule } from './mappers/user-schedule.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserScheduleApiService {
  constructor(private userScheduleHttpService: UserScheduleHttpService) {}

  public getHomePickUpDeliverySchedules(): Observable<any> {
    return this.userScheduleHttpService.getHomePickUpDeliverySchedules().pipe(map(mapUserScheduleDtoUserSchedule));
  }
}

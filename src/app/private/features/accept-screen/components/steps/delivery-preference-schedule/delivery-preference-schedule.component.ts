import { Component, Input } from '@angular/core';
import { DeliverySchedule } from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { UserScheduleApiService } from '@api/delivery/user_schedule/user-schedule-api.service';

@Component({
  selector: 'tsl-delivery-preference-schedule',
  templateUrl: './delivery-preference-schedule.component.html',
  styleUrls: ['./delivery-preference-schedule.component.scss'],
})
export class DeliveryPreferenceScheduleComponent {
  @Input() scheduleTypeSelected: SCHEDULE_TYPE;
  public readonly deliverySchedule$: DeliverySchedule;
  public readonly SCHEDULE_TYPE = SCHEDULE_TYPE;

  constructor(public userScheduleApiService: UserScheduleApiService) {}

  public selectScheduleTypePreference(type: SCHEDULE_TYPE): void {
    this.scheduleTypeSelected = type;
  }

  public savePreference(): void {
    this.userScheduleApiService.selectHomePickUpDeliverySchedule(null, this.scheduleTypeSelected).subscribe(
      () => {},
      () => {}
    );
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetUserScheduleApiService } from '@api/bff/delivery/user_schedule/get-user-schedule-api.service';
import {
  DeliverySchedule,
  DeliveryScheduleOption,
  DeliveryUserSchedule,
} from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { SelectUserScheduleApiService } from '@api/delivery/user_schedule/select-user-schedule-api.service';

@Component({
  selector: 'tsl-delivery-preference-schedule',
  templateUrl: './delivery-preference-schedule.component.html',
  styleUrls: ['./delivery-preference-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryPreferenceScheduleComponent implements OnInit {
  public selectedSchedule: DeliveryUserSchedule;
  public readonly SCHEDULE_TYPE = SCHEDULE_TYPE;
  private scheduleOptions: DeliveryScheduleOption[];

  constructor(
    private selectUserScheduleApiService: SelectUserScheduleApiService,
    private getUserScheduleApiService: GetUserScheduleApiService
  ) {}

  ngOnInit(): void {
    this.getUserScheduleApiService.homePickUpDeliverySchedules().subscribe((schedule: DeliverySchedule) => {
      this.scheduleOptions = schedule.scheduleOptions;
      this.selectedSchedule = schedule.userSchedule;
    });
  }

  public selectScheduleTypePreference(type: SCHEDULE_TYPE): void {
    this.selectedSchedule = { ...this.selectedSchedule, scheduleTimeRange: type };
  }

  public savePreference(): void {
    this.selectUserScheduleApiService
      .homePickUpDeliverySchedule(this.selectedSchedule.id, this.selectedSchedule.scheduleTimeRange)
      .subscribe(
        () => {},
        () => {}
      );
  }

  public get allDayDeliverySchedule(): DeliveryScheduleOption {
    return this.getDeliverySchedule(SCHEDULE_TYPE.ALL_DAY);
  }

  public get morningDeliverySchedule(): DeliveryScheduleOption {
    return this.getDeliverySchedule(SCHEDULE_TYPE.MORNING);
  }

  public get afternoonDeliverySchedule(): DeliveryScheduleOption {
    return this.getDeliverySchedule(SCHEDULE_TYPE.AFTERNOON);
  }

  private getDeliverySchedule(timeRange: SCHEDULE_TYPE): DeliveryScheduleOption {
    return this.scheduleOptions.find((schedule: DeliveryScheduleOption) => schedule.scheduleTimeRange === timeRange);
  }
}

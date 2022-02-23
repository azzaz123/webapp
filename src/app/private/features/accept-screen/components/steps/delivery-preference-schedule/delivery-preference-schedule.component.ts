import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GetUserScheduleApiService } from '@api/bff/delivery/user_schedule/get-user-schedule-api.service';
import { DeliverySchedule, DeliveryScheduleOptions } from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { SelectUserScheduleApiService } from '@api/delivery/user_schedule/select-user-schedule-api.service';

@Component({
  selector: 'tsl-delivery-preference-schedule',
  templateUrl: './delivery-preference-schedule.component.html',
  styleUrls: ['./delivery-preference-schedule.component.scss'],
})
export class DeliveryPreferenceScheduleComponent implements OnInit {
  @Input() deliveryPickUpDay: string;
  public selectedSchedule: SCHEDULE_TYPE;
  public availableSchedules: DeliveryScheduleOptions;
  public readonly SCHEDULE_TYPE = SCHEDULE_TYPE;

  private scheduleId: string;

  constructor(
    private selectUserScheduleApiService: SelectUserScheduleApiService,
    private getUserScheduleApiService: GetUserScheduleApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getSchedules();
  }

  public savePreference(): void {
    this.selectUserScheduleApiService.homePickUpDeliverySchedule(this.scheduleId, this.selectedSchedule).subscribe(
      () => {},
      () => {}
    );
  }

  private getSchedules(): void {
    this.getUserScheduleApiService.homePickUpDeliverySchedules().subscribe((schedule: DeliverySchedule) => {
      this.availableSchedules = schedule.scheduleOptions;
      this.scheduleId = schedule.userSchedule.id;
      this.selectedSchedule = schedule.userSchedule.scheduleTimeRange;
    });
  }
}

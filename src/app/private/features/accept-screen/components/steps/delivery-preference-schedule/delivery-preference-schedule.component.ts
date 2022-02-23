import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetUserScheduleApiService } from '@api/bff/delivery/user_schedule/get-user-schedule-api.service';
import { DeliverySchedule, DeliveryScheduleOptions } from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { SelectUserScheduleApiService } from '@api/delivery/user_schedule/select-user-schedule-api.service';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-delivery-preference-schedule',
  templateUrl: './delivery-preference-schedule.component.html',
  styleUrls: ['./delivery-preference-schedule.component.scss'],
})
export class DeliveryPreferenceScheduleComponent implements OnInit {
  @Input() deliveryPickUpDay: string;
  @Output() scheduleSaveSucceded: EventEmitter<void> = new EventEmitter();
  public selectedSchedule: SCHEDULE_TYPE;
  public availableSchedules: DeliveryScheduleOptions;
  public readonly SCHEDULE_TYPE = SCHEDULE_TYPE;

  private scheduleId: string;

  constructor(
    private selectUserScheduleApiService: SelectUserScheduleApiService,
    private getUserScheduleApiService: GetUserScheduleApiService,
    private errorsService: ErrorsService
  ) {}

  ngOnInit(): void {
    this.getSchedules();
  }

  public savePreference(): void {
    this.selectUserScheduleApiService.homePickUpDeliverySchedule(this.scheduleId, this.selectedSchedule).subscribe(
      () => {
        this.scheduleSaveSucceded.emit();
      },
      () => {
        this.showToastError(TRANSLATION_KEY.ACCEPT_SCREEN_SCHEDULES_GET_ERROR);
      }
    );
  }

  private getSchedules(): void {
    this.getUserScheduleApiService.homePickUpDeliverySchedules().subscribe(
      (schedule: DeliverySchedule) => {
        this.availableSchedules = schedule.scheduleOptions;
        this.scheduleId = schedule.userSchedule.id;
        this.selectedSchedule = schedule.userSchedule.scheduleTimeRange;
      },
      () => {
        this.showToastError(TRANSLATION_KEY.ACCEPT_SCREEN_SCHEDULES_SAVE_ERROR);
      }
    );
  }

  private showToastError(key: TRANSLATION_KEY): void {
    this.errorsService.i18nError(key);
  }
}

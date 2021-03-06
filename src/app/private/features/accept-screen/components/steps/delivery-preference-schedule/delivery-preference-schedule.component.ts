import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetUserScheduleApiService } from '@api/bff/delivery/user_schedule/get-user-schedule-api.service';
import { DeliverySchedule, DeliveryScheduleOptions } from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { SelectUserScheduleApiService } from '@api/delivery/user_schedule/select-user-schedule-api.service';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'tsl-delivery-preference-schedule',
  templateUrl: './delivery-preference-schedule.component.html',
  styleUrls: ['./delivery-preference-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryPreferenceScheduleComponent {
  @Input() deliveryPickUpDay: string;
  @Output() scheduleSaveSucceded: EventEmitter<void> = new EventEmitter();
  public availableSchedules$: Observable<DeliveryScheduleOptions> = this.getSchedules();
  public selectedSchedule: SCHEDULE_TYPE;
  public readonly SCHEDULE_TYPE = SCHEDULE_TYPE;
  public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly loadingIconSrc: string = '/assets/icons/spinner.svg';

  private scheduleId: string;

  constructor(
    private selectUserScheduleApiService: SelectUserScheduleApiService,
    private getUserScheduleApiService: GetUserScheduleApiService,
    private errorsService: ErrorsService
  ) {}

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

  private getSchedules(): Observable<DeliveryScheduleOptions> {
    return this.getUserScheduleApiService.homePickUpDeliverySchedules().pipe(
      tap(
        (schedule: DeliverySchedule) => {
          this.scheduleId = schedule.userSchedule.id;
          this.selectedSchedule = schedule.userSchedule.scheduleTimeRange;
          this.loading$.next(false);
        },
        () => {
          this.showToastError(TRANSLATION_KEY.ACCEPT_SCREEN_SCHEDULES_SAVE_ERROR);
          this.loading$.next(false);
        }
      ),
      map((schedule: DeliverySchedule) => schedule.scheduleOptions)
    );
  }

  private showToastError(key: TRANSLATION_KEY): void {
    this.errorsService.i18nError(key);
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetUserScheduleApiService } from '@api/bff/delivery/user_schedule/get-user-schedule-api.service';
import { SelectUserScheduleApiService } from '@api/delivery/user_schedule/select-user-schedule-api.service';
import { ErrorsService } from '@core/errors/errors.service';
import { MOCK_DELIVERY_SCHEDULE } from '@fixtures/private/delivery/schedule/delivery-schedule.fixtures.spec';
import { of } from 'rxjs';

import { DeliveryPreferenceScheduleComponent } from './delivery-preference-schedule.component';

describe('DeliveryPreferenceScheduleComponent', () => {
  let component: DeliveryPreferenceScheduleComponent;
  let fixture: ComponentFixture<DeliveryPreferenceScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryPreferenceScheduleComponent],
      providers: [
        {
          provide: SelectUserScheduleApiService,
          useValue: {
            homePickUpDeliverySchedule() {
              return of(null);
            },
          },
        },
        {
          provide: GetUserScheduleApiService,
          useValue: {
            homePickUpDeliverySchedules() {
              return of(MOCK_DELIVERY_SCHEDULE);
            },
          },
        },
        {
          provide: ErrorsService,
          useValue: {
            i18nError() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPreferenceScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we enter in the schedule page', () => {});

  describe('and we get the schedules', () => {
    it('should request the schedules', () => {});
    it('should show the template', () => {});
  });

  describe(`and we DON'T get the schedules`, () => {
    it('should request the schedules', () => {});
    it('should NOT show the template', () => {});
  });
});

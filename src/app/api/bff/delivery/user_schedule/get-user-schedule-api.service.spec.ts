import { TestBed } from '@angular/core/testing';
import { DeliverySchedule } from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { MOCK_USER_DELIVERY_SCHEDULE_DTO } from '@api/fixtures/delivery/user-schedule/user-delivery-schedule.dto.fixtures.spec';
import { MOCK_DELIVERY_SCHEDULE } from '@fixtures/private/delivery/schedule/delivery-schedule.fixtures.spec';
import { of } from 'rxjs';
import { GetUserScheduleHttpService } from './http/get-user-schedule-http.service';

import { GetUserScheduleApiService } from './get-user-schedule-api.service';

describe('GetUserScheduleApiService', () => {
  let service: GetUserScheduleApiService;
  let getUserScheduleHttpService: GetUserScheduleHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GetUserScheduleHttpService,
          useValue: {
            homePickUpDeliverySchedules() {
              return of(MOCK_USER_DELIVERY_SCHEDULE_DTO);
            },
          },
        },
      ],
    });
    service = TestBed.inject(GetUserScheduleApiService);
    getUserScheduleHttpService = TestBed.inject(GetUserScheduleHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting home pick up delivery schedules', () => {
    let result: DeliverySchedule;

    beforeEach(() => {
      spyOn(getUserScheduleHttpService, 'homePickUpDeliverySchedules').and.callThrough();
      service.homePickUpDeliverySchedules().subscribe((mappedSchedule: DeliverySchedule) => {
        result = mappedSchedule;
      });
    });

    it('should call the http service', () => {
      expect(getUserScheduleHttpService.homePickUpDeliverySchedules).toHaveBeenCalledTimes(1);
    });

    it('should return the delivery schedule mapped', () => {
      expect(result).toStrictEqual(MOCK_DELIVERY_SCHEDULE);
    });
  });
});

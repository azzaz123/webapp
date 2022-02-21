import { TestBed } from '@angular/core/testing';
import { DeliverySchedule } from '@api/core/model/delivery/schedule/delivery-schedule.interface';
import { MOCK_USER_DELIVERY_SCHEDULE_DTO } from '@api/fixtures/delivery/user-schedule/user-delivery-schedule.dto.fixtures.spec';
import { MOCK_DELIVERY_SCHEDULE } from '@fixtures/private/delivery/schedule/delivery-schedule.fixtures.spec';
import { of } from 'rxjs';
import { UserScheduleHttpService } from './http/user-schedule-http.service';

import { UserScheduleApiService } from './user-schedule-api.service';

describe('UserScheduleApiService', () => {
  let service: UserScheduleApiService;
  let userScheduleHttpService: UserScheduleHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserScheduleHttpService,
          useValue: {
            getHomePickUpDeliverySchedules() {
              return of(MOCK_USER_DELIVERY_SCHEDULE_DTO);
            },
          },
        },
      ],
    });
    service = TestBed.inject(UserScheduleApiService);
    userScheduleHttpService = TestBed.inject(UserScheduleHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting home pick up delivery schedules', () => {
    let result: DeliverySchedule;

    beforeEach(() => {
      spyOn(userScheduleHttpService, 'getHomePickUpDeliverySchedules').and.callThrough();
      service.getHomePickUpDeliverySchedules().subscribe((mappedSchedule: DeliverySchedule) => {
        result = mappedSchedule;
      });
    });

    it('should call the http service', () => {
      expect(userScheduleHttpService.getHomePickUpDeliverySchedules).toHaveBeenCalledTimes(1);
    });

    it('should return the delivery schedule mapped', () => {
      expect(result).toStrictEqual(MOCK_DELIVERY_SCHEDULE);
    });
  });
});

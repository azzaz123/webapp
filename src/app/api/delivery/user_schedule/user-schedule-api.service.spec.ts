import { TestBed } from '@angular/core/testing';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { Observable, of } from 'rxjs';
import { UserScheduleHttpService } from './http/user-schedule-http.service';
import { mapScheduleTypeDomainToDto } from './mappers/requests/schedule-type.mapper';

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
            selectHomePickUpDeliverySchedule(): Observable<void> {
              return of(null);
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

  describe('when the user asks to select home pick up delivery schedule', () => {
    const MOCK_SCHEDULE_ID: string = 'sbudwuy28';

    beforeEach(() => {
      spyOn(userScheduleHttpService, 'selectHomePickUpDeliverySchedule').and.callThrough();
      service.selectHomePickUpDeliverySchedule(MOCK_SCHEDULE_ID, SCHEDULE_TYPE.MORNING).subscribe();
    });

    it('should request it with mapped schedule type', () => {
      expect(userScheduleHttpService.selectHomePickUpDeliverySchedule).toHaveBeenCalledTimes(1);
      expect(userScheduleHttpService.selectHomePickUpDeliverySchedule).toHaveBeenCalledWith(
        MOCK_SCHEDULE_ID,
        mapScheduleTypeDomainToDto[SCHEDULE_TYPE.MORNING]
      );
    });
  });
});

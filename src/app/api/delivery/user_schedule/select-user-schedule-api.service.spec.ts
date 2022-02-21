import { TestBed } from '@angular/core/testing';
import { SCHEDULE_TYPE } from '@api/core/model/delivery/schedule/schedule-type.type';
import { Observable, of } from 'rxjs';
import { SelectUserScheduleHttpService } from './http/select-user-schedule-http.service';
import { mapScheduleTypeDomainToDto } from './mappers/requests/schedule-type.mapper';

import { SelectUserScheduleApiService } from './user-schedule-api.service';

describe('SelectUserScheduleApiService', () => {
  let service: SelectUserScheduleApiService;
  let selectUserScheduleHttpService: SelectUserScheduleHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SelectUserScheduleHttpService,
          useValue: {
            selectHomePickUpDeliverySchedule(): Observable<void> {
              return of(null);
            },
          },
        },
      ],
    });
    service = TestBed.inject(SelectUserScheduleApiService);
    selectUserScheduleHttpService = TestBed.inject(SelectUserScheduleHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when the user asks to select home pick up delivery schedule', () => {
    const MOCK_SCHEDULE_ID: string = 'sbudwuy28';

    beforeEach(() => {
      spyOn(selectUserScheduleHttpService, 'homePickUpDeliverySchedule').and.callThrough();
      service.homePickUpDeliverySchedule(MOCK_SCHEDULE_ID, SCHEDULE_TYPE.MORNING).subscribe();
    });

    it('should request it with mapped schedule type', () => {
      expect(selectUserScheduleHttpService.homePickUpDeliverySchedule).toHaveBeenCalledTimes(1);
      expect(selectUserScheduleHttpService.homePickUpDeliverySchedule).toHaveBeenCalledWith(
        MOCK_SCHEDULE_ID,
        mapScheduleTypeDomainToDto[SCHEDULE_TYPE.MORNING]
      );
    });
  });
});

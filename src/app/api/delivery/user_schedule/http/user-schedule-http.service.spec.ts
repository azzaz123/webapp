import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ScheduleTypeDto } from '../dtos/requests/schedule-type-dto.type';
import { UPDATE_DELIVERY_USER_SCHEDULE_ENDPOINT } from './endpoints';

import { UserScheduleHttpService } from './user-schedule-http.service';

describe('UserScheduleHttpService', () => {
  let service: UserScheduleHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserScheduleHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when the user asks to select home pick up delivery schedule', () => {
    it('should ask server to select it', () => {
      const MOCK_SCHEDULE_ID: string = '2bewuhd8w';
      const MOCK_SCHEDULE_TYPE: ScheduleTypeDto = 'afternoon';

      service.selectHomePickUpDeliverySchedule(MOCK_SCHEDULE_ID, MOCK_SCHEDULE_TYPE).subscribe();
      const req: TestRequest = httpMock.expectOne(UPDATE_DELIVERY_USER_SCHEDULE_ENDPOINT);
      req.flush({});

      expect(req.request.method).toBe('PUT');
      expect(req.request.url).toEqual(UPDATE_DELIVERY_USER_SCHEDULE_ENDPOINT);
      expect(req.request.body).toStrictEqual({
        id: MOCK_SCHEDULE_ID,
        schedule_time_range: MOCK_SCHEDULE_TYPE,
      });
    });
  });
});

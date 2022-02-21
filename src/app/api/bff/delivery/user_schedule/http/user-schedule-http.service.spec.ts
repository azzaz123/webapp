import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_USER_DELIVERY_SCHEDULE_DTO } from '@api/fixtures/delivery/user-schedule/user-delivery-schedule.dto.fixtures.spec';
import { DeliveryScheduleDto } from '../dtos/responses/delivery-schedule-dto.interface';
import { GET_DELIVERY_SCHEDULES_ENDPOINT } from './endpoints';

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

  describe('when the user asks to get home pick up delivery schedules', () => {
    let response: DeliveryScheduleDto;

    beforeEach(() => {
      service.getHomePickUpDeliverySchedules().subscribe((dto: DeliveryScheduleDto) => {
        response = dto;
      });
    });

    it('should ask server to get them', () => {
      const req: TestRequest = httpMock.expectOne(GET_DELIVERY_SCHEDULES_ENDPOINT);
      req.flush(MOCK_USER_DELIVERY_SCHEDULE_DTO);

      expect(req.request.method).toBe('GET');
      expect(req.request.url).toEqual(GET_DELIVERY_SCHEDULES_ENDPOINT);
      expect(req.request.body).toStrictEqual(null);
      expect(response).toStrictEqual(MOCK_USER_DELIVERY_SCHEDULE_DTO);
    });
  });
});

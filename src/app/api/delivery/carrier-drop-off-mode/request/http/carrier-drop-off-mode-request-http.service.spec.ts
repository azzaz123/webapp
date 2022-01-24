import { TestBed } from '@angular/core/testing';

import { CarrierDropOffModeRequestHttpService } from './carrier-drop-off-mode-request-http.service';
import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { CarrierDropOffModeRequestDto } from '../dtos/carrier-drop-off-mode-request-dto.interface';
import { CARRIER_DROP_OFF_MODE_REQUEST_WITH_REQUEST_ID } from './endpoints';
import { MOCK_CARRIER_DROP_OFF_MODE_DTO } from '@api/fixtures/delivery/carrier-drop-off-mode/carrier-drop-off-mode-dto.fixtures';

describe('CarrierDropOffModeRequestHttpService', () => {
  let service: CarrierDropOffModeRequestHttpService;
  const MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ID: string = '2134';
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CarrierDropOffModeRequestHttpService],
    });
    service = TestBed.inject(CarrierDropOffModeRequestHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the carrier drop of mode request by id to server', () => {
    it('should ask server for an specific request', () => {
      let response: CarrierDropOffModeRequestDto;
      const expectedUrl: string = CARRIER_DROP_OFF_MODE_REQUEST_WITH_REQUEST_ID(MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ID);

      service.get(MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ID).subscribe((data: CarrierDropOffModeRequestDto) => (response = data));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_CARRIER_DROP_OFF_MODE_DTO);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_CARRIER_DROP_OFF_MODE_DTO);
    });
  });
});

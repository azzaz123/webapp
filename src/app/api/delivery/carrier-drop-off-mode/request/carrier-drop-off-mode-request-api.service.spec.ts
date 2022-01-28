import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CarrierDropOffModeRequest } from '@api/core/model/delivery/carrier-drop-off-mode/carrier-drop-off-mode-request.interface';
import { MOCK_CARRIER_DROP_OFF_MODE_REQUEST_DTO } from '@api/fixtures/delivery/carrier-drop-off-mode/carrier-drop-off-mode-request-dto.fixtures';
import { of } from 'rxjs';
import { MOCK_CARRIER_DROP_OFF_MODE_REQUEST } from '@fixtures/private/delivery/accept-screen/carrier-drop-off-mode-request.fixtures.spec';
import { CarrierDropOffModeRequestApiService } from './carrier-drop-off-mode-request-api.service';
import { CarrierDropOffModeRequestHttpService } from './http/carrier-drop-off-mode-request-http.service';

describe('CarrierDropOffModeRequestApiService', () => {
  let service: CarrierDropOffModeRequestApiService;
  let carrierDropOffModeRequestHttpService: CarrierDropOffModeRequestHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CarrierDropOffModeRequestHttpService,
          useValue: {
            get() {
              return of(MOCK_CARRIER_DROP_OFF_MODE_REQUEST_DTO);
            },
          },
        },
      ],
    });
    service = TestBed.inject(CarrierDropOffModeRequestApiService);
    carrierDropOffModeRequestHttpService = TestBed.inject(CarrierDropOffModeRequestHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get a carrier drop off mode request', () => {
    const MOCK_REQUEST_ID = '3434343wsds';
    let response: CarrierDropOffModeRequest;

    beforeEach(fakeAsync(() => {
      spyOn(carrierDropOffModeRequestHttpService, 'get').and.callThrough();

      service.get(MOCK_REQUEST_ID).subscribe((data: CarrierDropOffModeRequest) => (response = data));
      tick();
    }));

    it('should ask server for request information', () => {
      expect(carrierDropOffModeRequestHttpService.get).toHaveBeenCalledTimes(1);
      expect(carrierDropOffModeRequestHttpService.get).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });

    it('should return the request response mapped into our model domain', () => {
      expect(JSON.stringify(response)).toStrictEqual(JSON.stringify(MOCK_CARRIER_DROP_OFF_MODE_REQUEST));
    });
  });
});

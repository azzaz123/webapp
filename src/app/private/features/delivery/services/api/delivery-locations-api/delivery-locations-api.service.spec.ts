import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_LOCATION } from '@fixtures/private/delivery/delivery-location.fixtures.spec';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { DeliveryLocationsApiService, DELIVERY_LOCATIONS_API_URL } from './delivery-locations-api.service';

describe('DeliveryLocationsApiService', () => {
  const postalCode = '08027';
  let service: DeliveryLocationsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryLocationsApiService],
    });
    service = TestBed.inject(DeliveryLocationsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting delivery location...', () => {
    it('should send a petition to get the delivery location', () => {
      const expectedURL = DELIVERY_LOCATIONS_API_URL(postalCode);
      let response: DeliveryLocationApi[];

      service.get(postalCode).subscribe((data: DeliveryLocationApi[]) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(expectedURL);
      req.flush([MOCK_DELIVERY_LOCATION]);

      expect(response).toEqual([MOCK_DELIVERY_LOCATION]);
      expect(req.request.url).toEqual(expectedURL);
      expect(req.request.method).toBe('GET');
    });
  });
});

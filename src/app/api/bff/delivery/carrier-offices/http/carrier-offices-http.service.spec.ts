import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_CARRIER_OFFICES_ADDRESSES_DTO } from '@api/fixtures/delivery/carrier-offices/carrier-offices-dto.fixtures.spec';
import { CarrierDto } from '@api/delivery/carrier-drop-off-mode/request/dtos/carrier-drop-off-mode-request-dto.interface';
import { CarrierOfficesHttpService } from './carrier-offices-http.service';
import { CARRIER_OFFICE_ADDRESSES_URL } from './endpoints';

describe('CarrierOfficesHttpService', () => {
  let service: CarrierOfficesHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(CarrierOfficesHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking carrier office addresses', () => {
    const MOCK_LATITUDE: number = 3435.1;
    const MOCK_LONGITUDE: number = 938293.3;
    const MOCK_RADIUS_KM: number = 2;
    const MOCK_CARRIER: CarrierDto = 'correos';
    let req: TestRequest;

    beforeEach(() => {
      service.getCarrierOfficeAddresses(MOCK_LATITUDE, MOCK_LONGITUDE, MOCK_RADIUS_KM, MOCK_CARRIER).subscribe();
      req = httpMock.expectOne(
        `${CARRIER_OFFICE_ADDRESSES_URL}?latitude=${MOCK_LATITUDE}&longitude=${MOCK_LONGITUDE}&radiusKm=${MOCK_RADIUS_KM}&carrier=${MOCK_CARRIER}`
      );
      req.flush(MOCK_CARRIER_OFFICES_ADDRESSES_DTO);
    });

    it('should ask server to get them', () => {
      expect(req.request.url).toEqual(CARRIER_OFFICE_ADDRESSES_URL);
      expect(req.request.body).toBe(null);
      expect(req.request.method).toEqual('GET');
    });

    it('should send the petition with specified params', () => {
      expect(req.request.params.get('latitude')).toEqual(MOCK_LATITUDE);
      expect(req.request.params.get('longitude')).toEqual(MOCK_LONGITUDE);
      expect(req.request.params.get('radiusKm')).toEqual(MOCK_RADIUS_KM);
      expect(req.request.params.get('carrier')).toEqual(MOCK_CARRIER);
    });
  });
});

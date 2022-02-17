import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_SELECTED_CARRIER_OFFICE_DTO } from '@api/fixtures/delivery/carrier-office-addresses/selected-carrier-office-dto.fixture.spec';
import { CarrierOfficeAddressesHttpService } from './carrier-office-addresses-http.service';
import { CREATE_SELECTED_CARRIER_OFFICE_ENDPOINT, UPDATE_SELECTED_CARRIER_OFFICE_ENDPOINT } from './endpoints';

describe('CarrierOfficeAddressesHttpService', () => {
  const MOCK_REQUEST_ID = 'ajbdsijd2e923nwsd';
  let service: CarrierOfficeAddressesHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CarrierOfficeAddressesHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to create a selected carrier office', () => {
    it('should ask server to create it', () => {
      service.createSelectedCarrierOffice(MOCK_SELECTED_CARRIER_OFFICE_DTO).subscribe();
      const req: TestRequest = httpMock.expectOne(CREATE_SELECTED_CARRIER_OFFICE_ENDPOINT);
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toStrictEqual({
        selectedOffice: MOCK_SELECTED_CARRIER_OFFICE_DTO,
      });
    });
  });

  describe('when asking to update a selected carrier office', () => {
    it('should ask server to update it', () => {
      service.updateSelectedCarrierOffice(MOCK_REQUEST_ID, MOCK_SELECTED_CARRIER_OFFICE_DTO).subscribe();
      const req: TestRequest = httpMock.expectOne(UPDATE_SELECTED_CARRIER_OFFICE_ENDPOINT(MOCK_REQUEST_ID));
      req.flush({});

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toStrictEqual({
        selectedOffice: MOCK_SELECTED_CARRIER_OFFICE_DTO,
      });
    });
  });
});

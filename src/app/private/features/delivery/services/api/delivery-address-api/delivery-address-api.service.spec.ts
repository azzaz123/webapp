import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_ADDRESS } from '@fixtures/private/delivery/delivery-address.fixtures.spec';
import { DeliveryAddressError, PhoneNumberIsInvalidError } from '@private/features/delivery/errors/classes/address';
import { DELIVERY_ADDRESS_ERROR_CODES } from '@private/features/delivery/errors/mappers/address/delivery-address-error.enum';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';

import { DeliveryAddressApiService, DELIVERY_ADDRESS_API_URL, DELIVERY_ADDRESS_ID } from './delivery-address-api.service';

describe('DeliveryAddressApiService', () => {
  let service: DeliveryAddressApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryAddressApiService],
    });
    service = TestBed.inject(DeliveryAddressApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting delivery address...', () => {
    it('should send a petition to get the delivery address', () => {
      let response: DeliveryAddressApi;

      service.get().subscribe((data: DeliveryAddressApi) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(DELIVERY_ADDRESS_API_URL);
      req.flush(MOCK_DELIVERY_ADDRESS);

      expect(response).toEqual(MOCK_DELIVERY_ADDRESS);
      expect(req.request.url).toEqual(DELIVERY_ADDRESS_API_URL);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Accept')).toBe(`application/vnd.get.address.v2+json`);
    });
  });

  describe('when creating the delivery address...', () => {
    it('should send a petition to create the delivery address', () => {
      service.create(MOCK_DELIVERY_ADDRESS).subscribe();
      const req: TestRequest = httpMock.expectOne(DELIVERY_ADDRESS_API_URL);
      req.flush({});

      expect(req.request.url).toEqual(DELIVERY_ADDRESS_API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Accept')).toBe(`application/vnd.create.address.v2+json`);
      expect(req.request.body).toEqual(MOCK_DELIVERY_ADDRESS);
    });

    describe('and when there is an unknown error from server', () => {
      it('should map to generic error', () => {
        let response: DeliveryAddressError[];

        service.create(MOCK_DELIVERY_ADDRESS).subscribe({
          error: (errorResponse: DeliveryAddressError[]) => (response = errorResponse),
        });
        const req: TestRequest = httpMock.expectOne(DELIVERY_ADDRESS_API_URL);
        req.error([{ error_code: 'unknown', message: 'rip' }] as any);

        expect(response[0] instanceof Error).toBe(true);
      });
    });

    describe('and when there is a known error from server', () => {
      it('should map to specific error', () => {
        let response: DeliveryAddressError[];

        service.create(MOCK_DELIVERY_ADDRESS).subscribe({
          error: (errorResponse: DeliveryAddressError[]) => (response = errorResponse),
        });
        const req: TestRequest = httpMock.expectOne(DELIVERY_ADDRESS_API_URL);
        req.error([{ error_code: DELIVERY_ADDRESS_ERROR_CODES.INVALID_PHONE_NUMBER, message: 'rip' }] as any);

        expect(response[0] instanceof PhoneNumberIsInvalidError).toBe(true);
      });
    });
  });

  describe('when updating delivery address...', () => {
    it('should update the delivery address', () => {
      service.update(MOCK_DELIVERY_ADDRESS).subscribe();
      const req: TestRequest = httpMock.expectOne(DELIVERY_ADDRESS_API_URL);
      req.flush({});

      expect(req.request.url).toEqual(DELIVERY_ADDRESS_API_URL);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Accept')).toBe(`application/vnd.update.address.v2+json`);
      expect(req.request.body).toEqual(MOCK_DELIVERY_ADDRESS);
    });

    describe('and when there is an unknown error from server', () => {
      it('should map to generic error', () => {
        let response: DeliveryAddressError[];

        service.update(MOCK_DELIVERY_ADDRESS).subscribe({
          error: (errorResponse: DeliveryAddressError[]) => (response = errorResponse),
        });
        const req: TestRequest = httpMock.expectOne(DELIVERY_ADDRESS_API_URL);
        req.error([{ error_code: 'unknown', message: 'rip' }] as any);

        expect(response[0] instanceof Error).toBe(true);
      });
    });

    describe('and when there is a known error from server', () => {
      it('should map to specific error', () => {
        let response: DeliveryAddressError[];

        service.update(MOCK_DELIVERY_ADDRESS).subscribe({
          error: (errorResponse: DeliveryAddressError[]) => (response = errorResponse),
        });
        const req: TestRequest = httpMock.expectOne(DELIVERY_ADDRESS_API_URL);
        req.error([{ error_code: DELIVERY_ADDRESS_ERROR_CODES.INVALID_PHONE_NUMBER, message: 'rip' }] as any);

        expect(response[0] instanceof PhoneNumberIsInvalidError).toBe(true);
      });
    });
  });

  describe('when deleting delivery address...', () => {
    it('should send a petition to delete the delivery address', () => {
      const expectedURL = DELIVERY_ADDRESS_ID(MOCK_DELIVERY_ADDRESS.id);

      service.delete(MOCK_DELIVERY_ADDRESS.id).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedURL);
      req.flush({});

      expect(req.request.url).toBe(expectedURL);
      expect(req.request.method).toBe('DELETE');
    });
  });
});

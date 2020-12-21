import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';

import { CarKeysService, CARS_KEYS_ENDPOINT } from './car-keys.service';
import { IOption } from '@shared/dropdown/utils/option.interface';
import {
  CAR_BODY_TYPES,
  CAR_BODY_TYPES_RESPONSE,
} from '../../../tests/car.fixtures.spec';
import { I18nService } from '../../core/i18n/i18n.service';

describe('CarKeysService', () => {
  let service: CarKeysService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarKeysService, I18nService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CarKeysService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getTypes', () => {
    it('should get cars body types options', () => {
      let response: IOption[];
      const expectedUrlParams = `language=en`;
      const expectedUrl = `${environment.baseUrl}${CARS_KEYS_ENDPOINT}/bodytype?${expectedUrlParams}`;

      service.getTypes().subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(CAR_BODY_TYPES_RESPONSE);

      expect(response).toEqual(CAR_BODY_TYPES);
      expect(req.request.urlWithParams).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getTypeName', () => {
    it('should get the body type name that matches with the provided id', () => {
      let response: string;
      const expectedUrlParams = `language=en`;
      const expectedUrl = `${environment.baseUrl}${CARS_KEYS_ENDPOINT}/bodytype?${expectedUrlParams}`;

      service.getTypeName('small_car').subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(CAR_BODY_TYPES_RESPONSE);

      expect(response).toEqual('Small');
      expect(req.request.urlWithParams).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});

import { TestBed } from '@angular/core/testing';
import {
  TestRequest,
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { IOption } from 'app/dropdown/utils/option.interface';

import { environment } from '../../../environments/environment';

import {
  RealestateKeysService,
  REAL_ESTATE_KEYS_ENDPOINT,
} from './realestate-keys.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { Key } from './key.interface';

describe('RealestateKeysService', () => {
  let service: RealestateKeysService;
  let httpMock: HttpTestingController;
  const MOCK_REAL_ESTATE_OPTIONS = [
    { id: 'test', icon_id: 'test', text: 'test' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealestateKeysService, I18nService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RealestateKeysService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getOperations', () => {
    it('should get real estate operations options', () => {
      let response: Key[];
      const expectedUrlParams = `language=en&filter=false`;
      const expectedUrl = `${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/operation?${expectedUrlParams}`;

      service.getOperations().subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_REAL_ESTATE_OPTIONS);

      expect(response).toEqual(MOCK_REAL_ESTATE_OPTIONS);
      expect(req.request.urlWithParams).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getTypes', () => {
    it('should get real estate type options', () => {
      const OPERATION = 'rent';
      let response: Key[];
      const expectedUrlParams = `language=en&operation=${OPERATION}`;
      const expectedUrl = `${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/type?${expectedUrlParams}`;

      service.getTypes(OPERATION).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_REAL_ESTATE_OPTIONS);

      expect(response).toEqual(MOCK_REAL_ESTATE_OPTIONS);
      expect(req.request.urlWithParams).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getConditions', () => {
    it('should get real estate condition options', () => {
      let response: IOption[];
      const expectedUrlParams = `language=en`;
      const expectedUrl = `${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/condition?${expectedUrlParams}`;

      service.getConditions().subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_REAL_ESTATE_OPTIONS);

      expect(response).toEqual([
        {
          value: 'test',
          label: 'test',
          icon_id: 'assets/icons/test.svg',
        },
      ]);
      expect(req.request.urlWithParams).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getExtras', () => {
    it('should get real estate extra options', () => {
      const TYPE = 'house';
      let response: Key[];
      const expectedUrlParams = `language=en&type=${TYPE}`;
      const expectedUrl = `${environment.baseUrl}${REAL_ESTATE_KEYS_ENDPOINT}/extra?${expectedUrlParams}`;

      service.getExtras(TYPE).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_REAL_ESTATE_OPTIONS);

      expect(response).toEqual(MOCK_REAL_ESTATE_OPTIONS);
      expect(req.request.urlWithParams).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});

import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { HttpServiceNew, DEFAULT_ERROR_MESSAGE } from './http.service.new';
import { environment } from '../../../environments/environment';
import { IDictionary } from '../../shared/models/dictionary.interface';
import { HttpModuleNew } from './http.module.new';
import { AccessTokenService } from './access-token.service';

const ENDPOINT_NAME = 'endpoint';
const BASE_WITH_ENDPOINT = environment.baseUrl + ENDPOINT_NAME;
const BASE_WITH_ENDP_AND_PARAMS = `${BASE_WITH_ENDPOINT}?foo=123&bar=456`;
const EXTERNAL_SITE_WITH_PARAMS = `${environment.siteUrl}?foo=123&bar=456`;

const MOCK_DATA: Array<any> = [
    {
        param1: '123',
        param2: '456'
    },
    {
        param1: 'ABC',
        param2: 'DEF'
    }
];

const MOCK_PARAMETERS: IDictionary[] = [
    {
        key: 'foo',
        value: 123
    },
    {
        key: 'bar',
        value: 456
    }
];

const MOCK_ERROR_EVENT: ErrorEvent = new ErrorEvent('error', { message: DEFAULT_ERROR_MESSAGE });

describe('HttpServiceNew', () => {
    let injector: TestBed;
    let httpService: HttpServiceNew;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        injector = getTestBed();
        injector.configureTestingModule({
            imports: [ HttpClientTestingModule, HttpModuleNew ],
            providers: [{
              provide: AccessTokenService, useValue: {
                accessToken: 'ACCESS_TOKEN'
              }
            }]
        });

        httpService = injector.get(HttpServiceNew);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create the instance', (() => {
        expect(httpService).toBeTruthy();
    }));

    describe('GET', () => {
        it('should have base URL at the beginning of every request', () => {
            httpService.get('').subscribe();
            const req: TestRequest = httpMock.expectOne(environment.baseUrl);
            req.flush({});

            expect(req.request.url).toBe(environment.baseUrl);
            expect(req.request.method).toBe('GET');
        });

        it('should capture error in observable', () => {
            let errorResponse: HttpErrorResponse;

            httpService.get('').subscribe(null, error => errorResponse = error);
            const req: TestRequest = httpMock.expectOne(environment.baseUrl);
            req.error(MOCK_ERROR_EVENT);

            expect(errorResponse.error.message).toBe(MOCK_ERROR_EVENT.message);
            expect(req.request.method).toBe('GET');
        });

        it('should add endpoint correctly to URL', () => {
            httpService.get(ENDPOINT_NAME).subscribe();
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDPOINT);
            req.flush({});

            expect(req.request.url).toBe(BASE_WITH_ENDPOINT);
            expect(req.request.method).toBe('GET');
        });

        it('should add parameters to URL', () => {
            httpService.get(ENDPOINT_NAME, MOCK_PARAMETERS).subscribe();
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDP_AND_PARAMS);
            req.flush({});

            expect(req.request.url).toBe(BASE_WITH_ENDPOINT);
            expect(req.request.urlWithParams).toBe(BASE_WITH_ENDP_AND_PARAMS);
            expect(req.request.method).toBe('GET');
        });

        it('should return valid object from backend response', () => {
            let dataResponse: Array<any>;

            httpService.get<Array<any>>(ENDPOINT_NAME).subscribe(response => dataResponse = response);
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDPOINT);
            req.flush(MOCK_DATA);

            expect(dataResponse).toBe(MOCK_DATA);
            expect(req.request.method).toBe('GET');
        });
    });

    describe('GET (no base)', () => {
        it('should use only URL passed', () => {
            httpService.getNoBase(environment.siteUrl).subscribe();
            const req: TestRequest = httpMock.expectOne(environment.siteUrl);
            req.flush({});

            expect(req.request.url).toBe(environment.siteUrl);
            expect(req.request.method).toBe('GET');
        });

        it('should capture error in observable', () => {
            let errorResponse: HttpErrorResponse;

            httpService.getNoBase(environment.siteUrl).subscribe(null, error => errorResponse = error);
            const req: TestRequest = httpMock.expectOne(environment.siteUrl);
            req.error(MOCK_ERROR_EVENT);

            expect(errorResponse.error.message).toBe(MOCK_ERROR_EVENT.message);
            expect(req.request.method).toBe('GET');
        });

        it('should add parameters to URL', () => {
            httpService.getNoBase(environment.siteUrl, MOCK_PARAMETERS).subscribe();
            const req: TestRequest = httpMock.expectOne(EXTERNAL_SITE_WITH_PARAMS);
            req.flush({});

            expect(req.request.url).toBe(environment.siteUrl);
            expect(req.request.urlWithParams).toBe(EXTERNAL_SITE_WITH_PARAMS);
            expect(req.request.method).toBe('GET');
        });

        it('should return valid object from backend response', () => {
            let dataResponse: Array<any>;

            httpService.getNoBase<Array<any>>(environment.siteUrl).subscribe(response => dataResponse = response);
            const req: TestRequest = httpMock.expectOne(environment.siteUrl);
            req.flush(MOCK_DATA);

            expect(dataResponse).toBe(MOCK_DATA);
            expect(req.request.method).toBe('GET');
        });
    });

    describe('POST', () => {
        it('should have base URL at the beginning of every request', () => {
            httpService.post('').subscribe();
            const req: TestRequest = httpMock.expectOne(environment.baseUrl);
            req.flush({});

            expect(req.request.url).toBe(environment.baseUrl);
            expect(req.request.method).toBe('POST');
        });

        it('should capture error in observable', () => {
            let errorResponse: HttpErrorResponse;

            httpService.post('').subscribe(null, error => errorResponse = error);
            const req: TestRequest = httpMock.expectOne(environment.baseUrl);
            req.error(MOCK_ERROR_EVENT);

            expect(errorResponse.error.message).toBe(MOCK_ERROR_EVENT.message);
            expect(req.request.method).toBe('POST');
        });

        it('should add endpoint correctly to URL', () => {
            httpService.post(ENDPOINT_NAME).subscribe();
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDPOINT);
            req.flush({});

            expect(req.request.url).toBe(BASE_WITH_ENDPOINT);
            expect(req.request.method).toBe('POST');
        });

        it('should return valid object from backend response', () => {
            let dataResponse: Array<any>;

            httpService.post<Array<any>>(ENDPOINT_NAME).subscribe(response => dataResponse = response);
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDPOINT);
            req.flush(MOCK_DATA);

            expect(dataResponse).toBe(MOCK_DATA);
            expect(req.request.method).toBe('POST');
        });

        it('should send proper body to backend', () => {
            httpService.post(ENDPOINT_NAME, MOCK_DATA).subscribe();
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDPOINT);
            req.flush(MOCK_DATA);

            expect(req.request.body).toEqual(MOCK_DATA);
            expect(req.request.method).toBe('POST');
        });

        it('should add parameters to URL', () => {
            httpService.post(ENDPOINT_NAME, MOCK_DATA, MOCK_PARAMETERS).subscribe();
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDP_AND_PARAMS);
            req.flush(MOCK_DATA);

            expect(req.request.url).toBe(BASE_WITH_ENDPOINT);
            expect(req.request.urlWithParams).toBe(BASE_WITH_ENDP_AND_PARAMS);
            expect(req.request.method).toBe('POST');
        });
    });

    describe('POST (no base)', () => {
        it('should use only URL passed', () => {
            httpService.postNoBase(environment.siteUrl).subscribe();
            const req: TestRequest = httpMock.expectOne(environment.siteUrl);
            req.flush({});

            expect(req.request.url).toBe(environment.siteUrl);
            expect(req.request.method).toBe('POST');
        });

        it('should capture error in observable', () => {
            let errorResponse: HttpErrorResponse;

            httpService.postNoBase(environment.siteUrl).subscribe(null, error => errorResponse = error);
            const req: TestRequest = httpMock.expectOne(environment.siteUrl);
            req.error(MOCK_ERROR_EVENT);

            expect(errorResponse.error.message).toBe(MOCK_ERROR_EVENT.message);
            expect(req.request.method).toBe('POST');
        });

        it('should return valid object from backend response', () => {
            let dataResponse: Array<any>;

            httpService.postNoBase<Array<any>>(environment.siteUrl).subscribe(response => dataResponse = response);
            const req: TestRequest = httpMock.expectOne(environment.siteUrl);
            req.flush(MOCK_DATA);

            expect(dataResponse).toBe(MOCK_DATA);
            expect(req.request.method).toBe('POST');
        });

        it('should send proper body to backend', () => {
            httpService.postNoBase(environment.siteUrl, MOCK_DATA).subscribe();
            const req: TestRequest = httpMock.expectOne(environment.siteUrl);
            req.flush(MOCK_DATA);

            expect(req.request.body).toEqual(MOCK_DATA);
            expect(req.request.method).toBe('POST');
        });

        it('should add parameters to URL', () => {
            httpService.postNoBase(environment.siteUrl, MOCK_DATA, MOCK_PARAMETERS).subscribe();
            const req: TestRequest = httpMock.expectOne(EXTERNAL_SITE_WITH_PARAMS);
            req.flush(MOCK_DATA);

            expect(req.request.url).toBe(environment.siteUrl);
            expect(req.request.urlWithParams).toBe(EXTERNAL_SITE_WITH_PARAMS);
            expect(req.request.method).toBe('POST');
        });
    });

    describe('PUT', () => {
        it('should have base URL at the beginning of every request', () => {
            httpService.put('').subscribe();
            const req: TestRequest = httpMock.expectOne(environment.baseUrl);
            req.flush({});

            expect(req.request.url).toBe(environment.baseUrl);
            expect(req.request.method).toBe('PUT');
        });

        it('should capture error in observable', () => {
            let errorResponse: HttpErrorResponse;

            httpService.put('').subscribe(null, error => errorResponse = error);
            const req: TestRequest = httpMock.expectOne(environment.baseUrl);
            req.error(MOCK_ERROR_EVENT);

            expect(errorResponse.error.message).toBe(MOCK_ERROR_EVENT.message);
            expect(req.request.method).toBe('PUT');
        });

        it('should add endpoint correctly to URL', () => {
            httpService.put(ENDPOINT_NAME).subscribe();
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDPOINT);
            req.flush({});

            expect(req.request.url).toBe(BASE_WITH_ENDPOINT);
            expect(req.request.method).toBe('PUT');
        });

        it('should return valid object from backend response', () => {
            let dataResponse: Array<any>;

            httpService.put(ENDPOINT_NAME, MOCK_DATA, MOCK_PARAMETERS).subscribe(response => dataResponse = response);
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDP_AND_PARAMS);
            req.flush(MOCK_DATA);

            expect(dataResponse).toBe(MOCK_DATA);
            expect(req.request.method).toBe('PUT');
        });

        it('should send proper body to backend', () => {
            httpService.put(ENDPOINT_NAME, MOCK_DATA, MOCK_PARAMETERS).subscribe();
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDP_AND_PARAMS);
            req.flush(MOCK_DATA);

            expect(req.request.body).toEqual(MOCK_DATA);
            expect(req.request.method).toBe('PUT');
        });

        it('should add parameters to URL', () => {
            httpService.put(ENDPOINT_NAME, MOCK_DATA, MOCK_PARAMETERS).subscribe();
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDP_AND_PARAMS);
            req.flush(MOCK_DATA);

            expect(req.request.url).toBe(BASE_WITH_ENDPOINT);
            expect(req.request.urlWithParams).toBe(BASE_WITH_ENDP_AND_PARAMS);
            expect(req.request.method).toBe('PUT');
        });
    });

    describe('DELETE', () => {
        it('should have base URL at the beginning of every request', () => {
            httpService.delete('').subscribe();
            const req: TestRequest = httpMock.expectOne(environment.baseUrl);
            req.flush({});

            expect(req.request.url).toBe(environment.baseUrl);
            expect(req.request.method).toBe('DELETE');
        });

        it('should capture error in observable', () => {
            let errorResponse: HttpErrorResponse;

            httpService.delete('').subscribe(null, error => errorResponse = error);
            const req: TestRequest = httpMock.expectOne(environment.baseUrl);
            req.error(MOCK_ERROR_EVENT);

            expect(errorResponse.error.message).toBe(MOCK_ERROR_EVENT.message);
            expect(req.request.method).toBe('DELETE');
        });

        it('should add endpoint correctly to URL', () => {
            httpService.delete(ENDPOINT_NAME).subscribe();
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDPOINT);
            req.flush({});

            expect(req.request.url).toBe(BASE_WITH_ENDPOINT);
            expect(req.request.method).toBe('DELETE');
        });

        it('should add parameters to URL', () => {
            httpService.delete(ENDPOINT_NAME, MOCK_PARAMETERS).subscribe();
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDP_AND_PARAMS);
            req.flush({});

            expect(req.request.url).toBe(BASE_WITH_ENDPOINT);
            expect(req.request.urlWithParams).toBe(BASE_WITH_ENDP_AND_PARAMS);
            expect(req.request.method).toBe('DELETE');
        });

        it('should return valid object from backend response', () => {
            let dataResponse: Array<any>;

            httpService.delete<Array<any>>(ENDPOINT_NAME, MOCK_PARAMETERS).subscribe(response => dataResponse = response);
            const req: TestRequest = httpMock.expectOne(BASE_WITH_ENDP_AND_PARAMS);
            req.flush(MOCK_DATA);

            expect(dataResponse).toBe(MOCK_DATA);
            expect(req.request.method).toBe('DELETE');
        });
    });
});

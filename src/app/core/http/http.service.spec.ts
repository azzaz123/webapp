/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Headers,
  Http,
  RequestOptions,
  Response,
  ResponseOptions
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AccessTokenService } from './access-token.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { EventService } from '../event/event.service';

describe('Service: Http', () => {

  const TEST_BODY: any = {test: 'test', test2: 'test2'};
  const TEST_URL = '/testUrl';
  const FORM_URL_ENCODED = 'application/x-www-form-urlencoded';

  let httpService: HttpService;
  let mockBackend: MockBackend;
  let http: Http;
  let accessTokenService: AccessTokenService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService,
        ...TEST_HTTP_PROVIDERS,
        {
          provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
    httpService = TestBed.get(HttpService);
    eventService = TestBed.get(EventService);
    mockBackend = TestBed.get(MockBackend);
    accessTokenService = TestBed.get(AccessTokenService);
    http = TestBed.get(Http);
    accessTokenService.storeAccessToken(null);
  });

  it('should create the instance', () => {
    expect(httpService).toBeTruthy();
  });

  describe('get', () => {
    it('should return a get with the prepended url',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.get(TEST_URL).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.get(TEST_URL).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl);
      }));

    it('should return a get with the queryencoded params',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.get(TEST_URL, {
          test: 'hola',
          question: 42
        }).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.get(TEST_URL).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl + '?test=hola&question=42');
      }));

    it('should return a get with the queryencoded array',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.get(TEST_URL, {
          list: ['a', 'b', 'c'],
          question: 42
        }).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.get(TEST_URL).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl + '?list=a&list=b&list=c&question=42');
      }));

    it('should return a get with the queryencoded object',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.get(TEST_URL, {
          question: 42,
          object: {
            first: 1,
            second: 2,
            third: undefined
          }
        }).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.get(TEST_URL).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl + '?question=42&object[first]=1&object[second]=2');
      }));

    it('should return a get without the queryencoded params if are empty',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.get(TEST_URL, {}).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.get(TEST_URL).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl);
      }));

    it('should return a get without the queryencoded params if some keys are undefined or null',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        let undefValue: any;
        const nullValue: any = null;
        httpService.get(TEST_URL, {
          key: undefValue,
          test: nullValue
        }).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.get(TEST_URL).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl);
      }));

    it('should return a get with the appended headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.get(TEST_URL).subscribe();
        expect(headers.keys().length).toBe(1);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
      }));

    it('should return a get with the appended headers and the custom headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.get(TEST_URL, null, options).subscribe();
        expect(headers.keys().length).toBe(3);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));

    it('should return a get with no bypass header if is not local env',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        const bypass: string = environment['bypass'];
        environment['bypass'] = undefined;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.get(TEST_URL, null).subscribe();
        expect(headers.keys().length).toBe(1);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
        environment['bypass'] = bypass;
      }));

    it('should return a get with no appended headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.get(TEST_URL).subscribe();
        expect(headers.keys().length).toBe(0);
        expect(headers.has('Authorization')).toBeFalsy();
      }));
  });

  describe('request', () => {
    it('should return a request, without being modified',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.request(TEST_URL).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.request(TEST_URL).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(httpUrl);
      }));

    it('should return a request, without headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.request(TEST_URL).subscribe();
        expect(headers.keys().length).toBe(0);
      }));

    it('should return a request with the same custom headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.request(TEST_URL, options).subscribe();
        expect(headers.keys().length).toBe(2);
        expect(headers.has('Authorization')).toBeFalsy();
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));
  });

  describe('put', () => {
    it('should return a put with the prepended url',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.put(TEST_URL, TEST_BODY).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.put(TEST_URL, TEST_BODY).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl);
      }));

    it('should return a put with the appended headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.put(TEST_URL, TEST_BODY).subscribe();
        expect(headers.keys().length).toBe(1);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
      }));

    it('should return a put with the appended headers and the custom headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.put(TEST_URL, TEST_BODY, options).subscribe();
        expect(headers.keys().length).toBe(3);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));

    it('should return a put with no appended headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.put(TEST_URL, TEST_BODY).subscribe();
        expect(headers.keys().length).toBe(0);
        expect(headers.has('Authorization')).toBeFalsy();
      }));

    it('should return a put with only the custom headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.put(TEST_URL, TEST_BODY, options).subscribe();
        expect(headers.keys().length).toBe(2);
        expect(headers.has('Authorization')).toBeFalsy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));
  });

  describe('delete', () => {
    it('should return a delete with the prepended url',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.delete(TEST_URL).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.delete(TEST_URL).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl);
      }));

    it('should return a delete with the appended headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.delete(TEST_URL).subscribe();
        expect(headers.keys().length).toBe(1);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
      }));

    it('should return a delete with the appended headers and the custom headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.delete(TEST_URL, options).subscribe();
        expect(headers.keys().length).toBe(3);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));

    it('should return a delete with no appended headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.delete(TEST_URL).subscribe();
        expect(headers.keys().length).toBe(0);
        expect(headers.has('Authorization')).toBeFalsy();
      }));

    it('should return a delete with only the custom headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.delete(TEST_URL, options).subscribe();
        expect(headers.keys().length).toBe(2);
        expect(headers.has('Authorization')).toBeFalsy();
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));
  });

  describe('patch', () => {
    it('should return a patch with the prepended url',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.patch(TEST_URL, TEST_BODY).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.patch(TEST_URL, TEST_BODY).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl);
      }));

    it('should return a patch with the appended headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.patch(TEST_URL, TEST_BODY).subscribe();
        expect(headers.keys().length).toBe(1);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
      }));

    it('should return a patch with the appended headers and the custom headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.patch(TEST_URL, TEST_BODY, options).subscribe();
        expect(headers.keys().length).toBe(3);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));

    it('should return a patch with no appended headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.patch(TEST_URL, TEST_BODY).subscribe();
        expect(headers.keys().length).toBe(0);
        expect(headers.has('Authorization')).toBeFalsy();
      }));

    it('should return a patch with only the custom headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.patch(TEST_URL, TEST_BODY, options).subscribe();
        expect(headers.keys().length).toBe(2);
        expect(headers.has('Authorization')).toBeFalsy();
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));
  });

  describe('head', () => {
    it('should return a head with the prepended url',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.head(TEST_URL).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.head(TEST_URL).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl);
      }));

    it('should return a head with the appended headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.head(TEST_URL).subscribe();
        expect(headers.keys().length).toBe(1);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
      }));

    it('should return a head with the appended headers and the custom headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.head(TEST_URL, options).subscribe();
        expect(headers.keys().length).toBe(3);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));

    it('should return a head with no appended headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.head(TEST_URL).subscribe();
        expect(headers.keys().length).toBe(0);
        expect(headers.has('Authorization')).toBeFalsy();
      }));

    it('should return a head with only the custom headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.head(TEST_URL, options).subscribe();
        expect(headers.keys().length).toBe(2);
        expect(headers.has('Authorization')).toBeFalsy();
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));
  });

  describe('options', () => {
    it('should return a options with the prepended url',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.options(TEST_URL).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.options(TEST_URL).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl);
      }));

    it('should return a options with the appended headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.options(TEST_URL).subscribe();
        expect(headers.keys().length).toBe(1);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
      }));

    it('should return a options with the appended headers and the custom headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.options(TEST_URL, options).subscribe();
        expect(headers.keys().length).toBe(3);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));

    it('should return a options with no appended headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.options(TEST_URL).subscribe();
        expect(headers.keys().length).toBe(0);
        expect(headers.has('Authorization')).toBeFalsy();
      }));

    it('should return a options with only the custom headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.options(TEST_URL, options).subscribe();
        expect(headers.keys().length).toBe(2);
        expect(headers.has('Authorization')).toBeFalsy();
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));
  });

  describe('post', () => {
    it('should return a post with the prepended url',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.post(TEST_URL, TEST_BODY).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.post(TEST_URL, TEST_BODY).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(environment['baseUrl'] + httpUrl);
      }));

    it('should return a post with the appended headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.post(TEST_URL, TEST_BODY).subscribe();
        expect(headers.keys().length).toBe(1);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
      }));

    it('should return a post with the appended headers and the custom headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.post(TEST_URL, TEST_BODY, options).subscribe();
        expect(headers.keys().length).toBe(3);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));

    it('should return a post with no appended headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.post(TEST_URL, TEST_BODY).subscribe();
        expect(headers.keys().length).toBe(0);
        expect(headers.has('Authorization')).toBeFalsy();
      }));

    it('should return a post with only the custom headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.post(TEST_URL, TEST_BODY, options).subscribe();
        expect(headers.keys().length).toBe(2);
        expect(headers.has('Authorization')).toBeFalsy();
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));
  });

  describe('postNoBase', () => {
    it('should return a post with the prepended url',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: JSON.stringify({}), url: connection.request.url}
          );
          connection.mockRespond(new Response(response));
        });
        let httpServiceUrl: string = null;
        let httpUrl: string = null;
        httpService.postNoBase(TEST_URL, TEST_BODY).subscribe((r: any) => {
          httpServiceUrl = r.url;
        });
        http.post(TEST_URL, TEST_BODY).subscribe((r: any) => {
          httpUrl = r.url;
        });
        expect(httpServiceUrl).toBe(httpUrl);
      }));

    it('should return a post with the appended headers',
      fakeAsync(() => {
        spyOn(http, 'post').and.callThrough();
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.postNoBase(TEST_URL, TEST_BODY, 'stringAuthorization').subscribe();
        expect(headers.keys().length).toBe(1);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('stringAuthorization');
      }));

    describe('with retry strategy', () => {
      it('should not retry when it encounters an error that is not present in the retryOnStatuses array (throw the encountered error)', () => {
        const testErrorCode = 404;
        const testError = {status: testErrorCode};
        expect(httpService['retryOnStatuses'].indexOf(testErrorCode)).toBe(-1);
        spyOn(http, 'post').and.returnValue(Observable.throw(testError));

        httpService.postNoBase(TEST_URL, TEST_BODY, 'stringAuthorization', null, true).subscribe(() => {},
        (err) => expect(err).toBe(testError));
      });

      it(`should emit the quitRetryMsg after retrying mockMaxRetries times,
      when it encounters an error that is present in the retryOnStatuses array`, (done) => {
        spyOn(eventService, 'emit');
        httpService['initialRetryInterval'] = 0;
        const testErrorCode = httpService['retryOnStatuses'][0];
        const testError = {status: testErrorCode};
        spyOn(Http.prototype, 'post').and.returnValues(Observable.throw(testError), null);

        httpService.postNoBase(TEST_URL, TEST_BODY, 'stringAuthorization', null, true).subscribe(() => {},
        (err) => {
          expect(eventService.emit).toHaveBeenCalledWith(EventService.HTTP_REQUEST_FAILED, TEST_URL);
          expect(err).toEqual({message: httpService.quitRetryMsg, url: TEST_URL});
          done();
        });
      });
    });

  });

  describe('postUrlEncoded', () => {
    it('should perform a post with the xx-www-form-urlencoded content-type',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: connection.request.getBody(), url: connection.request.url, headers: connection.request.headers}
          );
          connection.mockRespond(new Response(response));
        });
        httpService.postUrlEncoded(TEST_URL, TEST_BODY).subscribe((r: any) => {
          expect(r.headers.get('content-type')).toBe(FORM_URL_ENCODED);
        });
      }));

    it('should perform a post with the url encoded body',
      fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const response: ResponseOptions = new ResponseOptions(
            {body: connection.request.getBody(), url: connection.request.url}
          );
          expect(connection.request.getBody()).toBe('test=test&test2=test2');
          connection.mockRespond(new Response(response));
        });
        httpService.postUrlEncoded(TEST_URL, TEST_BODY).subscribe();
      }));

    it('should return a post with the appended headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.postUrlEncoded(TEST_URL, TEST_BODY).subscribe();
        expect(headers.keys().length).toBe(2);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
        expect(headers.has('content-type')).toBeTruthy();
        expect(headers.get('content-type')).toBe(FORM_URL_ENCODED);
      }));

    it('should return a post with the appended headers and the custom headers',
      fakeAsync(() => {
        let headers: Headers;
        accessTokenService.storeAccessToken('thetoken');
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.postUrlEncoded(TEST_URL, TEST_BODY, options).subscribe();
        expect(headers.keys().length).toBe(4);
        expect(headers.has('Authorization')).toBeTruthy();
        expect(headers.get('Authorization')).toBe('Bearer thetoken');
        expect(headers.has('content-type')).toBeTruthy();
        expect(headers.get('content-type')).toBe(FORM_URL_ENCODED);
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));

    it('should return a post with no appended headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        httpService.postUrlEncoded(TEST_URL, TEST_BODY).subscribe();
        expect(headers.keys().length).toBe(1);
        expect(headers.has('Authorization')).toBeFalsy();
        expect(headers.has('content-type')).toBeTruthy();
        expect(headers.get('content-type')).toBe(FORM_URL_ENCODED);
      }));

    it('should return a post with only the custom headers if user not logged',
      fakeAsync(() => {
        let headers: Headers;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          headers = connection.request.headers;
        });
        const options: RequestOptions = new RequestOptions({
          headers: new Headers({
            'Accept-Language': 'es_ES',
            'DeviceID': 'postman_santi'
          })
        });
        httpService.postUrlEncoded(TEST_URL, TEST_BODY, options).subscribe();
        expect(headers.keys().length).toBe(3);
        expect(headers.has('Authorization')).toBeFalsy();
        expect(headers.has('content-type')).toBeTruthy();
        expect(headers.get('content-type')).toBe(FORM_URL_ENCODED);
        expect(headers.has('Accept-Language')).toBeTruthy();
        expect(headers.get('Accept-Language')).toBe('es_ES');
        expect(headers.has('DeviceID')).toBeTruthy();
        expect(headers.get('DeviceID')).toBe('postman_santi');
      }));

  });

  describe('getOptions', () => {
    let options: RequestOptions;
    const URL = '/api/v3/test';
    const METHOD = 'GET';
    const TIME = 123456;
    describe('addSignature true', () => {
      beforeEach(() => {
        accessTokenService.storeAccessToken('token');
        spyOn<any>(window, 'Date').and.returnValue({
          getTime: () => {
            return TIME;
          }
        });
        options = httpService['getOptions'](null, URL, METHOD);
      });
      it('should append Timestamp', () => {
        expect(options.headers.get('Timestamp')).toBe(TIME.toString());
      });
      it('should append X-Signature', () => {
        expect(options.headers.has('X-Signature')).toBeTruthy();
      });
    });
  });

  describe('should add body to options', () => {
    it('body should be empty if options has no configured body', () => {
      const options = null;
      expect(httpService.getOptions(options, 'url', 'GET').body).toEqual(null);
    });

    it('body should has body if options has body', () => {
      const payload = { payload: 'payload' };
      const options = { body: payload };
      expect(httpService.getOptions(options, 'url', 'GET').body).toEqual(payload);
    });
  });
});

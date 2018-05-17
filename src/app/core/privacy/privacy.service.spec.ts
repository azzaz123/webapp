import { TestBed, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions } from '@angular/http';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { PrivacyService } from './privacy.service';
import {
  PrivacyList,
  PrivacyStatus,
  PRIVACY_STATUS
} from './privacy';
import {
  MOCK_PRIVACY_ALLOW,
  MOCK_PRIVACY_DISALLOW,
  MOCK_PRIVACY_UNKNOW
} from './privacy.fixtures.spec';
import { environment } from '../../../environments/environment';

let http: HttpService;

describe('PrivacyService', () => {
  let mockBackend: MockBackend;
  let service: PrivacyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TEST_HTTP_PROVIDERS,
        PrivacyService]
    });
    service = TestBed.get(PrivacyService);
    http = TestBed.get(HttpService);
    mockBackend = TestBed.get(MockBackend);
  });

  describe('updatePrivacy', () => {
    beforeEach(fakeAsync(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_ALLOW)});
        connection.mockRespond(new Response(res));
      });
    }));

    it('should call to url and get privacy list', fakeAsync(() => {
      let privacyList: PrivacyList;

      service.updatePrivacy({gdpr_display: {

      }}).subscribe((r: PrivacyList) => {
        privacyList = r;
      });

      expect(privacyList).toEqual(MOCK_PRIVACY_ALLOW);
    }));
  });

  describe('getPrivacyList', () => {
    describe('', () => {
      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
          const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_ALLOW)});
          connection.mockRespond(new Response(res));
        });
      }));
      it('should get privacy list', fakeAsync(() => {
        let privacyList: PrivacyList;

        service.getPrivacyList().subscribe((r: PrivacyList) => {
          privacyList = r;
        });

        expect(privacyList).toEqual(MOCK_PRIVACY_ALLOW);
      }));

      it('should change _privacyList property', fakeAsync(() => {
        let privacyList: PrivacyList;

        service.getPrivacyList().subscribe();

        expect(service['_privacyList']).toEqual(MOCK_PRIVACY_ALLOW);
      }));
    });

    describe('when privacy permission is allow', () => {
      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
          const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_ALLOW)});
          connection.mockRespond(new Response(res));
        });
      }));

      it('should trigger allowSegmentation$ to true', fakeAsync(() => {
        let allowSegmentation = false;

        service.allowSegmentation$.subscribe((isAllow) => {
          allowSegmentation = isAllow;
        });
        service.getPrivacyList().subscribe();

        expect(allowSegmentation).toBe(true);
      }));
    });

    describe('when privacy permission is disallow', () => {
      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
          const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_DISALLOW)});
          connection.mockRespond(new Response(res));
        });
      }));

      it('should trigger allowSegmentation$ to false', fakeAsync(() => {
        let allowSegmentation = true;

        service.allowSegmentation$.subscribe((isAllow) => {
          allowSegmentation = isAllow;
        });
        service.getPrivacyList().subscribe();

        expect(allowSegmentation).toBe(false);
      }));
    });

    describe('when privacy permission is unknow', () => {
      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
          const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_UNKNOW)});
          connection.mockRespond(new Response(res));
        });
      }));

      it('should trigger allowSegmentation$ to false, when gdpr_display version 0 is unknow', fakeAsync(() => {
        let allowSegmentation = true;

        service.allowSegmentation$.subscribe((isAllow) => {
          allowSegmentation = isAllow;
        });
        service.getPrivacyList().subscribe();

        expect(allowSegmentation).toBe(false);
      }));
    });
  });

  describe('getPrivacyState',() => {
    it('should be allow permission status of gdpr_display version 0', () => {
      let status: string;
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_ALLOW)});
        connection.mockRespond(new Response(res));
      });

      service.getPrivacyList().subscribe();
      status = service.getPrivacyState('gdpr_display', '0');

      expect(status).toEqual(PRIVACY_STATUS.allow);
    });

    it('should be allow permission status of gdpr_display version 0', () => {
      let status: string;
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_DISALLOW)});
        connection.mockRespond(new Response(res));
      });

      service.getPrivacyList().subscribe();
      status = service.getPrivacyState('gdpr_display', '0');

      expect(status).toEqual(PRIVACY_STATUS.disallow);
    });

    it('should be unknow permission status of gdpr_display version 0', () => {
      let status: string;
      mockBackend.connections.subscribe((connection:  MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/privacy');
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_PRIVACY_UNKNOW)});
        connection.mockRespond(new Response(res));
      });

      service.getPrivacyList().subscribe();
      status = service.getPrivacyState('gdpr_display', '0');

      expect(status).toEqual(PRIVACY_STATUS.unknown);
    });
  });

});

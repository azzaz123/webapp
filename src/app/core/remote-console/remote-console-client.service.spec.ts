import { getTestBed, TestBed } from '@angular/core/testing';

import { RemoteConsoleClientService } from './remote-console-client.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('RemoteConsoleClientService', () => {
  let service: RemoteConsoleClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RemoteConsoleClientService],
    });

    service = TestBed.inject(RemoteConsoleClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('info', () => {
    it('should send info log', () => {
      service.info({ json: 'json' });

      const req = httpMock.expectOne(environment.remoteConsoleUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ logs: [{ json: 'json' }] });
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { RemoteConsoleClientService } from './remote-console-client.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as localEnvironmentFile from '@environments/environment';
import * as prodEnvironmentFile from '@environments/environment.prod';
import { Environment } from '@environments/environment.interface';

describe('RemoteConsoleClientService', () => {
  let service: RemoteConsoleClientService;
  let httpMock: HttpTestingController;

  const localEnvironment: Environment = localEnvironmentFile.environment;
  const prodEnvironment: Environment = prodEnvironmentFile.environment;

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

  describe('when environment is production', () => {
    beforeEach(() => {
      Object.defineProperty(localEnvironmentFile, 'environment', { value: prodEnvironment });
    });

    describe('and when sending metrics', () => {
      it('should send info log', () => {
        service.info({ json: 'json' });

        const req = httpMock.expectOne(prodEnvironment.remoteConsoleUrl);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual({ logs: [{ json: 'json' }] });
      });
    });
  });

  describe('when environment is development', () => {
    beforeEach(() => {
      Object.defineProperty(localEnvironmentFile, 'environment', { value: localEnvironment });
    });

    describe('and when sending metrics', () => {
      it('should NOT send info log', () => {
        service.info({ json: 'json' });

        httpMock.expectNone(localEnvironment.remoteConsoleUrl);
      });
    });
  });
});

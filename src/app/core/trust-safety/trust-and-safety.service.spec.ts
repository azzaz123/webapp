import { TestBed } from '@angular/core/testing';

import { TrustAndSafetyService } from './trust-and-safety.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('TrustAndSafetyService', () => {
  let service: TrustAndSafetyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TrustAndSafetyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking server if user is an starter user', () => {
    it('should ask server for the first time', () => {

    });

    it('should NOT ask server when using cache', () => {

    });

    it('should ask server if not using cache and already saved', () => {

    });
  });

  describe('when initializing profiling', () => {
    it('should ask server if user is starter', () => {

    });

    describe('and when the user is starter', () => {
      it('should start Threat Metrix', () => {

      });
    });

    describe('and when the user is not an starter', () => {
      it('should not initialize Threat Metrix', () => {

      });
    });

    describe('and when the server does not respond', () => {
      it('should not initialize Threat Metrix', () => {

      });
    });
  });

  describe('when sending profiling to server', () => {
    it('should send valid information only once', () => {

    });
  });
});

import { mergeMap } from 'rxjs/operators';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { mockFeatureFlagsResponses, mockFeatureFlagsEnum } from '../../../tests';
import { AccessTokenService } from '../http/access-token.service';
import * as coreLibrary from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { MockPermissionsService } from '@fixtures/permissions.fixtures';
import { FEATURE_FLAGS_ENUM } from './featureflag-constants';
import { FeatureflagService, FEATURE_FLAG_ENDPOINT } from './featureflag.service';
import { PERMISSIONS } from './user-constants';

const isDevMode = jasmine.createSpy().and.returnValue(true);

Object.defineProperty(coreLibrary, 'isDevMode', {
  value: isDevMode,
});

describe('FeatureflagService', () => {
  let injector: TestBed;
  let service: FeatureflagService;
  let httpMock: HttpTestingController;
  let permissionService: NgxPermissionsService;
  const TIMESTAMP = 123456789;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FeatureflagService,
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: 'ACCESS_TOKEN',
          },
          getTokenSignature() {
            return 'thesignature';
          },
        },
        {
          provide: NgxPermissionsService,
          useClass: MockPermissionsService,
        },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FeatureflagService);
    permissionService = TestBed.inject(NgxPermissionsService);
    isDevMode.and.returnValue(false);
    spyOn<any>(window, 'Date').and.returnValue({ getTime: () => TIMESTAMP });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the instance', () => {
    expect(service).toBeTruthy();
  });

  describe('getFlag', () => {
    it('should call valid endpoint', () => {
      const featureFlagName = mockFeatureFlagsEnum.FLAG1;
      const expectedUrlParams = `featureFlags=${featureFlagName}&timestamp=${TIMESTAMP}`;
      const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
      const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;

      service.getFlag(featureFlagName as any).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
      req.flush([]);

      expect(req.request.url).toBe(expectedUrlWithEndpoint);
      expect(req.request.urlWithParams.toString()).toBe(expectedUrlWithEndpointAndParams);
      expect(req.request.method).toBe('GET');
    });

    it('should not do extra HTTP request when feature flag was already fetched', () => {
      const featureFlagName = mockFeatureFlagsEnum.FLAG1;
      const expectedUrlParams = `featureFlags=${featureFlagName}&timestamp=${TIMESTAMP}`;
      const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
      const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;

      service
        .getFlag(featureFlagName as any)
        .pipe(
          mergeMap(() => {
            return service.getFlag(featureFlagName as any);
          })
        )
        .subscribe();

      const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
      req.flush([]);
    });

    it('should return boolean observable with valid value', () => {
      const featureFlagName = mockFeatureFlagsEnum.FLAG1;
      const mockResponse = mockFeatureFlagsResponses.find((mff) => mff.name === featureFlagName);
      const expectedUrlParams = `featureFlags=${featureFlagName}&timestamp=${TIMESTAMP}`;
      const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
      const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;
      let dataResponse: boolean;

      service.getFlag(featureFlagName as any).subscribe((isActive) => (dataResponse = isActive));
      const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
      req.flush([mockResponse]);

      expect(dataResponse).toBe(mockResponse.active);
    });

    describe('when handling delivery flag...', () => {
      describe('and the experimentalFeatures are enabled...', () => {
        it('should return true', () => {
          spyOn(localStorage, 'getItem').and.returnValue(true);
          isDevMode.and.returnValue(false);
          let dataResponse: boolean;

          service.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).subscribe((isActive) => (dataResponse = isActive));

          expect(dataResponse).toBe(true);
        });
      });

      describe('and is dev mode...', () => {
        it('should return true', () => {
          spyOn(localStorage, 'getItem').and.returnValue(false);
          isDevMode.and.returnValue(true);
          let dataResponse: boolean;

          service.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).subscribe((isActive) => (dataResponse = isActive));

          expect(dataResponse).toBe(true);
        });
      });

      describe('and is NOT dev mode and the experimentalFeatures are not enabled...', () => {
        it('should return false', () => {
          spyOn(localStorage, 'getItem').and.returnValue(false);
          isDevMode.and.returnValue(false);
          let dataResponse: boolean;

          service.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).subscribe((isActive) => (dataResponse = isActive));

          expect(dataResponse).toBe(false);
        });
      });
    });
    describe('Permissions', () => {
      beforeEach(() => {
        spyOn(permissionService, 'addPermission').and.callThrough();
        spyOn(permissionService, 'removePermission').and.callThrough();
      });
      describe('when feature flag is active', () => {
        describe('and has permissions configured', () => {
          it('should set permissions', () => {
            const expectedUrlParams = `featureFlags=${FEATURE_FLAGS_ENUM.BUMPS}&timestamp=${TIMESTAMP}`;
            const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
            const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;

            service.getFlag(FEATURE_FLAGS_ENUM.BUMPS).subscribe();
            const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
            req.flush([{ name: FEATURE_FLAGS_ENUM.BUMPS, active: true }]);

            expect(permissionService.addPermission).toBeCalledTimes(1);
            expect(permissionService.addPermission).toHaveBeenCalledWith(PERMISSIONS.bumps);
          });
          it('should not remove permissions', () => {
            const expectedUrlParams = `featureFlags=${FEATURE_FLAGS_ENUM.BUMPS}&timestamp=${TIMESTAMP}`;
            const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
            const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;

            service.getFlag(FEATURE_FLAGS_ENUM.BUMPS).subscribe();
            const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
            req.flush([{ name: FEATURE_FLAGS_ENUM.BUMPS, active: true }]);

            expect(permissionService.removePermission).not.toHaveBeenCalled();
          });
        });
        describe('and has not permissions configured', () => {
          it('should not set permissions', () => {
            const expectedUrlParams = `featureFlags=${FEATURE_FLAGS_ENUM.STRIPE}&timestamp=${TIMESTAMP}`;
            const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
            const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;

            service.getFlag(FEATURE_FLAGS_ENUM.STRIPE).subscribe();
            const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
            req.flush([{ name: FEATURE_FLAGS_ENUM.STRIPE, active: true }]);

            expect(permissionService.addPermission).not.toHaveBeenCalled();
          });
        });
      });
      describe('when feature flag is not active', () => {
        it('should not add permissions', () => {
          const expectedUrlParams = `featureFlags=${FEATURE_FLAGS_ENUM.BUMPS}&timestamp=${TIMESTAMP}`;
          const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
          const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;

          service.getFlag(FEATURE_FLAGS_ENUM.BUMPS).subscribe();
          const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
          req.flush([{ name: FEATURE_FLAGS_ENUM.BUMPS, active: false }]);

          expect(permissionService.addPermission).not.toHaveBeenCalled();
        });
        it('should remove permissions', () => {
          const expectedUrlParams = `featureFlags=${FEATURE_FLAGS_ENUM.BUMPS}&timestamp=${TIMESTAMP}`;
          const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
          const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;

          service.getFlag(FEATURE_FLAGS_ENUM.BUMPS).subscribe();
          const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
          req.flush([{ name: FEATURE_FLAGS_ENUM.BUMPS, active: false }]);

          expect(permissionService.removePermission).toBeCalledTimes(1);
          expect(permissionService.removePermission).toHaveBeenCalledWith(PERMISSIONS.bumps);
        });
      });
    });
  });
});

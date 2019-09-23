import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';


import { FeatureflagService, FEATURE_FLAG_ENDPOINT } from './featureflag.service';
import { environment } from '../../../environments/environment';
import { mockFeatureFlags, FeatureFlagServiceMock } from '../../../tests';
import { HttpServiceNew } from '../http/http.service.new';

describe('FeatureflagService', () => {
  let injector: TestBed;
  let service: FeatureflagService;
  let httpMock: HttpTestingController;
  const TIMESTAMP = 123456789;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ HttpServiceNew, FeatureflagService ]
    });
    httpMock = injector.get(HttpTestingController);
    service = injector.get(FeatureflagService);

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
      const featureFlagName = 'flag';
      const expectedUrlParams = `featureFlags=${featureFlagName}&timestamp=${TIMESTAMP}`;
      const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
      const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;

      service.getFlag(featureFlagName).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
      req.flush([]);

      expect(req.request.url).toBe(expectedUrlWithEndpoint);
      expect(req.request.urlWithParams.toString()).toBe(expectedUrlWithEndpointAndParams);
      expect(req.request.method).toBe('GET');
    });

    it('should not do extra HTTP request when feature flag was already fetched', () => {
      const featureFlagName = 'flag';
      const expectedUrlParams = `featureFlags=${featureFlagName}&timestamp=${TIMESTAMP}`;
      const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
      const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;

      service.getFlag(featureFlagName).flatMap(() => {
        return service.getFlag(featureFlagName);
      }).subscribe();

      const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
      req.flush([]);
    });

    it('should return boolean observable with valid value', () => {
      const featureFlagName = mockFeatureFlags[0].name;
      const expectedUrlParams = `featureFlags=${featureFlagName}&timestamp=${TIMESTAMP}`;
      const expectedUrlWithEndpoint = `${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`;
      const expectedUrlWithEndpointAndParams = `${expectedUrlWithEndpoint}?${expectedUrlParams}`;
      let dataResponse: boolean;

      service.getFlag(featureFlagName).subscribe(active => dataResponse = active);
      const req: TestRequest = httpMock.expectOne(expectedUrlWithEndpointAndParams);
      req.flush([mockFeatureFlags[0]]);

      expect(dataResponse).toBe(mockFeatureFlags[0].active);
    });
  });

  describe('getInboxFeatureFlag', () => {
    it('should call featureflagService.getFlag when called', () => {
      spyOn(service, 'getFlag');

      service.getWebInboxProjections();

      expect(service.getFlag).toHaveBeenCalledWith('web_inbox_projections');
    });
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FeatureflagService } from '@core/user/featureflag.service';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';

import { DeliveryDevelopmentGuard } from './delivery-development.guard';

describe('DeliveryDevelopmentGuard', () => {
  let guard: DeliveryDevelopmentGuard;
  let featureFlagService: FeatureflagService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FeatureFlagServiceMock,
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
      ],
    });

    guard = TestBed.inject(DeliveryDevelopmentGuard);
    featureFlagService = TestBed.inject(FeatureflagService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when the feature flag gets the delivery feature flag...', () => {
    it('should return true', () => {
      spyOn(featureFlagService, 'getDeliveryFeatureFlag').and.returnValue(true);

      expect(guard.canLoad()).toBe(true);
    });
  });

  describe(`when the feature flag don't get the delivery feature flag...`, () => {
    beforeEach(() => {
      spyOn(featureFlagService, 'getDeliveryFeatureFlag').and.returnValue(false);
      spyOn(router, 'navigate');
    });

    it('should redirect to the chat', () => {
      guard.canLoad();

      expect(router.navigate).toHaveBeenCalledWith(['/chat']);
    });

    it('should return false', () => {
      expect(guard.canLoad()).toBe(false);
    });
  });
});

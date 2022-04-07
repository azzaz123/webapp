import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DeliveryExperimentalFeaturesService } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';
import { BehaviorSubject } from 'rxjs';

import { DeliveryDevelopmentGuard } from './delivery-development.guard';

describe('DeliveryDevelopmentGuard', () => {
  const featuresEnabledSuject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  let guard: DeliveryDevelopmentGuard;
  let deliveryExperimentalFeaturesService: DeliveryExperimentalFeaturesService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DeliveryDevelopmentGuard,
        {
          provide: DeliveryExperimentalFeaturesService,
          useValue: {
            featuresEnabled$: featuresEnabledSuject.asObservable(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
      ],
    });

    guard = TestBed.inject(DeliveryDevelopmentGuard);
    deliveryExperimentalFeaturesService = TestBed.inject(DeliveryExperimentalFeaturesService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when the feature flag gets the delivery feature flag...', () => {
    it('should return true', () => {
      featuresEnabledSuject.next(true);
      let flagResponse: boolean;

      guard.canLoad().subscribe((isActive: boolean) => (flagResponse = isActive));

      expect(flagResponse).toBe(true);
    });
  });

  describe(`when the feature flag don't get the delivery feature flag...`, () => {
    beforeEach(() => {
      featuresEnabledSuject.next(false);
      spyOn(router, 'navigate');
    });

    it('should redirect to the chat', () => {
      guard.canLoad().subscribe();

      expect(router.navigate).toHaveBeenCalledWith(['/chat']);
    });

    it('should return false', () => {
      let flagResponse: boolean;

      guard.canLoad().subscribe((isActive: boolean) => (flagResponse = isActive));

      expect(flagResponse).toBe(false);
    });
  });
});

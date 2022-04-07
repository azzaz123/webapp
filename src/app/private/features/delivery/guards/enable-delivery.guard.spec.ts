import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DELIVERY_EXPERIMENTAL_FEATURES_KEY } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';

import { EnableDeliveryExperimentalFeaturesGuard } from './enable-delivery.guard';

describe('EnableDeliveryExperimentalFeaturesGuard', () => {
  let guard: EnableDeliveryExperimentalFeaturesGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnableDeliveryExperimentalFeaturesGuard,
        {
          provide: localStorage,
          useValue: {
            setItem: () => {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
      ],
    });

    router = TestBed.inject(Router);
    guard = TestBed.inject(EnableDeliveryExperimentalFeaturesGuard);
  });

  describe('when loading a route', () => {
    it('should enable the delivery experimental features', () => {
      spyOn(localStorage, 'setItem');

      guard.canActivate();

      expect(localStorage.setItem).toHaveBeenCalledWith(DELIVERY_EXPERIMENTAL_FEATURES_KEY, 'true');
    });

    it('should redirect to the search route', () => {
      spyOn(router, 'navigate');

      guard.canActivate();

      expect(router.navigate).toHaveBeenCalledWith([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.SEARCH}`]);
    });
  });
});

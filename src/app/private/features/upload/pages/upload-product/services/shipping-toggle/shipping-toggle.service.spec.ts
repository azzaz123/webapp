import { TestBed } from '@angular/core/testing';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { of } from 'rxjs';
import { ShippingToggleService } from './shipping-toggle.service';

describe('ShippingToggleService', () => {
  let service: ShippingToggleService;
  let featureFlagService: FeatureFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShippingToggleService,
        {
          provide: FeatureFlagService,
          useValue: {
            getFlag() {
              return of(false);
            },
          },
        },
      ],
    });
    service = TestBed.inject(ShippingToggleService);
    featureFlagService = TestBed.inject(FeatureFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking for shipping toggle state', () => {
    it('should return same state as feature flag', () => {
      featureFlagService.getFlag(FEATURE_FLAGS_ENUM.SHIPPING_TOGGLE).subscribe((isActive) => {
        expect(isActive).toBeTruthy();
      });
    });
  });
});

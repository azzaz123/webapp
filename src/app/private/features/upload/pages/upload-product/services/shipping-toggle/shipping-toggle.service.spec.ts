import { TestBed } from '@angular/core/testing';
import { FALLBACK_SHIPPING_RULES_RESPONSE } from '@api/bff/delivery/rules/constants/fallback-shipping-rules-response';
import { DeliveryRulesApiService } from '@api/bff/delivery/rules/delivery-rules-api.service';
import { mapShippingRulesResponseToShippingRules } from '@api/bff/delivery/rules/mappers/shipping-rules-mapper';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { of } from 'rxjs';
import { ShippingToggleAllowance } from './interfaces/shipping-toggle-allowance.interface';
import { ShippingToggleService } from './shipping-toggle.service';

describe('ShippingToggleService', () => {
  let service: ShippingToggleService;
  let featureFlagService: FeatureFlagService;
  const featureFlagValue = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShippingToggleService,
        {
          provide: FeatureFlagService,
          useValue: {
            getFlag() {
              return of(featureFlagValue);
            },
          },
        },
        {
          provide: DeliveryRulesApiService,
          useValue: {
            getRules() {
              return of(mapShippingRulesResponseToShippingRules(FALLBACK_SHIPPING_RULES_RESPONSE));
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

  describe('when asking for shipping toggle allowance', () => {
    describe('and all the data allows it', () => {
      const allowedCategoryId = '1';
      const allowedSubategoryId = '1';
      const allowedPrice = 2;

      it('should return allowance to true', (done) => {
        const expected: ShippingToggleAllowance = {
          category: true,
          subcategory: true,
          price: true,
        };

        service.isAllowed(allowedCategoryId, allowedSubategoryId, allowedPrice).subscribe((shippingToggleAllowance) => {
          expect(shippingToggleAllowance).toEqual(expected);
          done();
        });
      });
    });

    describe('and some of the data is not defined', () => {
      it('should return to true the data that is not defined', (done) => {
        const notAllowedSubategoryId = FALLBACK_SHIPPING_RULES_RESPONSE.subcategories_with_shipping_not_allowed[0].toString();

        const expected: ShippingToggleAllowance = {
          category: true,
          subcategory: false,
          price: true,
        };

        service.isAllowed(undefined, notAllowedSubategoryId, undefined).subscribe((shippingToggleAllowance) => {
          expect(shippingToggleAllowance).toEqual(expected);
          done();
        });
      });
    });

    describe('and NOT all the data allows it', () => {
      const allowedCategoryId = '1';
      const allowedSubategoryId = '1';
      const allowedPrice = 2;

      it('should return allowance to false if category is not allowed', (done) => {
        const notAllowedCategoryId = FALLBACK_SHIPPING_RULES_RESPONSE.categories_with_shipping_not_allowed[0].toString();
        const expected: ShippingToggleAllowance = {
          category: false,
          subcategory: true,
          price: true,
        };

        service.isAllowed(notAllowedCategoryId, allowedSubategoryId, allowedPrice).subscribe((shippingToggleAllowance) => {
          expect(shippingToggleAllowance).toEqual(expected);
          done();
        });
      });

      it('should return allowance to false if subcategory is not allowed', (done) => {
        const notAllowedSubategoryId = FALLBACK_SHIPPING_RULES_RESPONSE.subcategories_with_shipping_not_allowed[0].toString();
        const expected: ShippingToggleAllowance = {
          category: true,
          subcategory: false,
          price: true,
        };

        service.isAllowed(allowedCategoryId, notAllowedSubategoryId, allowedPrice).subscribe((shippingToggleAllowance) => {
          expect(shippingToggleAllowance).toEqual(expected);
          done();
        });
      });

      it('should return allowance to false if price is not allowed', (done) => {
        const notAllowedPrice = 0;
        const expected: ShippingToggleAllowance = {
          category: true,
          subcategory: true,
          price: false,
        };

        service.isAllowed(allowedCategoryId, allowedSubategoryId, notAllowedPrice).subscribe((shippingToggleAllowance) => {
          expect(shippingToggleAllowance).toEqual(expected);
          done();
        });
      });
    });
  });
});

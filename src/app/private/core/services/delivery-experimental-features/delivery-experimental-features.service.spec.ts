import { TestBed } from '@angular/core/testing';

import { DeliveryExperimentalFeaturesService } from './delivery-experimental-features.service';

describe('DeliveryExperimentalFeaturesService', () => {
  let service: DeliveryExperimentalFeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryExperimentalFeaturesService,
        {
          provide: localStorage,
          useValue: {
            getItem: () => {},
          },
        },
      ],
    });
    service = TestBed.inject(DeliveryExperimentalFeaturesService);
  });

  describe('featuresEnabled$', () => {
    describe('when the delivery experimental features are enabled', () => {
      it('should return true', (done) => {
        spyOn(localStorage, 'getItem').and.returnValue(true);

        service.featuresEnabled$.subscribe((enabled) => {
          expect(enabled).toBe(true);
          done();
        });
      });
    });

    describe('when the delivery experimental features are not enabled', () => {
      it('should return false', (done) => {
        spyOn(localStorage, 'getItem').and.returnValue(false);

        service.featuresEnabled$.subscribe((enabled) => {
          expect(enabled).toBe(false);
          done();
        });
      });
    });
  });
});

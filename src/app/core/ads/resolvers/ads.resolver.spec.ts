import { TestBed } from '@angular/core/testing';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';

import { AdsService } from '../services';
import { AdsResolver } from './ads.resolver';

describe('AdsResolver', () => {
  let resolver: AdsResolver;
  let adsService: AdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AdsService,
          useClass: MockAdsService,
        },
      ],
    });
    resolver = TestBed.inject(AdsResolver);
    adsService = TestBed.inject(AdsService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('when loading a route with ads', () => {
    it('should init ads', () => {
      spyOn(adsService, 'init');

      resolver.resolve();

      expect(adsService.init).toHaveBeenCalledTimes(1);
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AdKeyWords } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { PERMISSIONS } from '@core/user/user-constants';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { MockPermissionsService } from '@fixtures/permissions.fixtures';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { NgxPermissionsService } from 'ngx-permissions';

import { SearchAdsResolver } from './search-ads.resolver';

const MOCK_AD_KEYWORD = 'iPhone 13';

describe('SearchAdsResolver', () => {
  let resolver: SearchAdsResolver;
  let adsService: AdsService;
  let permissionService: NgxPermissionsService;
  let activatedRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchAdsResolver,
        {
          provide: AdsService,
          useValue: MockAdsService,
        },
        {
          provide: NgxPermissionsService,
          useClass: MockPermissionsService,
        },
        {
          provide: ActivatedRouteSnapshot,
          useValue: {
            queryParams: {
              [FILTER_QUERY_PARAM_KEY.keywords]: MOCK_AD_KEYWORD,
            },
          },
        },
      ],
    });
    resolver = TestBed.inject(SearchAdsResolver);
    adsService = TestBed.inject(AdsService);
    permissionService = TestBed.inject(NgxPermissionsService);
    activatedRoute = TestBed.inject(ActivatedRouteSnapshot);
  });

  describe('when loading the search page', () => {
    describe('and user has permission to see ads', () => {
      beforeEach(() => {
        spyOn(permissionService, 'getPermission').and.returnValue({ name: PERMISSIONS.showAds });
      });

      it('should set the configuration to display ads based on the search keyword', () => {
        const expectedAdKeywords: AdKeyWords = { content: MOCK_AD_KEYWORD };
        spyOn(adsService, 'setAdKeywords');

        resolver.resolve(activatedRoute);

        expect(adsService.setAdKeywords).toHaveBeenCalledWith(expectedAdKeywords);
      });

      it('should initialize the ads in the page', () => {
        const expectedAdKeywords: AdKeyWords = { content: MOCK_AD_KEYWORD };
        spyOn(adsService, 'init');

        resolver.resolve(activatedRoute);

        expect(adsService.init).toHaveBeenCalledTimes(1);
      });
    });
  });
});

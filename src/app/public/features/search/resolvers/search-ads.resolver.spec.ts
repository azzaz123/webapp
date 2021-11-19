import { TestBed } from '@angular/core/testing';
import { PERMISSIONS } from '@core/user/user-constants';
import { MockSearchAdsService } from '@fixtures/ads.fixtures.spec';
import { MockPermissionsService } from '@fixtures/permissions.fixtures';
import { NgxPermissionsService } from 'ngx-permissions';
import { SearchAdsService } from '../core/ads/search-ads.service';

import { SearchAdsResolver } from './search-ads.resolver';

describe('SearchAdsResolver', () => {
  let resolver: SearchAdsResolver;
  let searchAdsService: SearchAdsService;
  let permissionService: NgxPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchAdsResolver,
        {
          provide: SearchAdsService,
          useValue: MockSearchAdsService,
        },
        {
          provide: NgxPermissionsService,
          useClass: MockPermissionsService,
        },
      ],
    });
    resolver = TestBed.inject(SearchAdsResolver);
    searchAdsService = TestBed.inject(SearchAdsService);
    permissionService = TestBed.inject(NgxPermissionsService);
  });

  describe('when loading the search page', () => {
    describe('and user has permission to see ads', () => {
      beforeEach(() => {
        spyOn(permissionService, 'getPermission').and.returnValue({ name: PERMISSIONS.showAds });
      });

      it('should init the search ads service', () => {
        spyOn(searchAdsService, 'init');

        resolver.resolve();

        expect(searchAdsService.init).toHaveBeenCalled();
      });
    });
  });
});

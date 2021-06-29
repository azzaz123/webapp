import { TestBed } from '@angular/core/testing';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';

import { AdsService } from '../services';
import { AdsResolver } from './ads.resolver';
import { NgxPermissionsService } from 'ngx-permissions';
import { MockPermissionsService } from '@fixtures/permissions.fixtures';
import { PERMISSIONS } from '@core/user/user-constants';

describe('AdsResolver', () => {
  let resolver: AdsResolver;
  let adsService: AdsService;
  let permissionService: NgxPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AdsService,
          useValue: MockAdsService,
        },
        {
          provide: NgxPermissionsService,
          useClass: MockPermissionsService,
        },
      ],
    });
    resolver = TestBed.inject(AdsResolver);
    adsService = TestBed.inject(AdsService);
    permissionService = TestBed.inject(NgxPermissionsService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('when loading a route with ads', () => {
    describe('and user has permission to see ads', () => {
      it('should init ads', () => {
        spyOn(adsService, 'init');
        spyOn(permissionService, 'getPermission').and.returnValue({ name: PERMISSIONS.showAds });

        resolver.resolve();

        expect(adsService.init).toHaveBeenCalledTimes(1);
      });
    });

    describe('and user has no permission to see ads', () => {
      it('should NOT init ads', () => {
        spyOn(adsService, 'init');
        spyOn(permissionService, 'getPermission').and.returnValue(false);

        resolver.resolve();

        expect(adsService.init).toHaveBeenCalledTimes(0);
      });
    });
  });
});

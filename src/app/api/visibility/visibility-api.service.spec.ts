import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { BumpsPackageUse } from '@api/core/model/bumps/bumps-package-use';
import { MOCK_BUMPS_PACKAGE_BALANCE, MOCK_BUMPS_PACKAGE_BALANCE_MAPPED } from '@fixtures/bump-package.fixtures.spec';
import { of } from 'rxjs';
import { BumpsHttpService } from './http/bumps.service';
import { VisibilityApiService } from './visibility-api.service';

describe('VisibilityApiService', () => {
  let service: VisibilityApiService;
  let httpService: BumpsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BumpsHttpService, VisibilityApiService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(VisibilityApiService);
    httpService = TestBed.inject(BumpsHttpService);
  });

  describe('when asked to retrieve bumps package balance', () => {
    it('should return domain bumps package balance formatted', () => {
      spyOn(httpService, 'getBalance').and.returnValue(of(MOCK_BUMPS_PACKAGE_BALANCE));
      let response: BumpsPackageBalance[];
      const userId = '123';

      service.getBalance(userId).subscribe((data: BumpsPackageBalance[]) => {
        response = data;
      });

      expect(httpService.getBalance).toHaveBeenCalledTimes(1);
      expect(response).toEqual(MOCK_BUMPS_PACKAGE_BALANCE_MAPPED);
    });
  });

  describe('when use bumps from subscription package', () => {
    it('should return response', () => {
      spyOn(httpService, 'useBumpPackage').and.returnValue(of({}));
      const cart: BumpsPackageUse[] = [
        {
          id: '123456',
          item_id: '123456',
          type: BUMP_TYPE.COUNTRY_BUMP,
        },
      ];
      service.bumpWithPackage(cart).subscribe(() => {});

      expect(httpService.useBumpPackage).toHaveBeenCalledTimes(1);
    });
  });
});

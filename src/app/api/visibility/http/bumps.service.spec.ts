import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { BumpsPackageUse } from '@api/core/model/bumps/bumps-package-use';
import { MOCK_BUMPS_PACKAGE_BALANCE } from '@fixtures/bump-package.fixtures.spec';
import { BumpsPackageBalanceDTO } from '../dtos/bumps/bumps-package-balance.interface';
import { BumpsHttpService } from './bumps.service';
import { BUMPS_PACKAGE_BALANCE, BUMPS_PACKAGE_USE } from './endpoints';

describe('BumpsService', () => {
  let service: BumpsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BumpsHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BumpsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('when asked to retrieve balance', () => {
    it('should retrieve bumps balance', () => {
      let response: BumpsPackageBalanceDTO[];
      let userId = '123';

      service.getBalance(userId).subscribe((res: BumpsPackageBalanceDTO[]) => (response = res));

      const req: TestRequest = httpMock.expectOne(BUMPS_PACKAGE_BALANCE(userId));
      req.flush(MOCK_BUMPS_PACKAGE_BALANCE);

      expect(response).toEqual(MOCK_BUMPS_PACKAGE_BALANCE);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('when asked to bumps items using bumps package', () => {
    it('should retrieve subscription slots', () => {
      const cart: BumpsPackageUse[] = [
        {
          id: '123456',
          item_id: '123456',
          type: BUMP_TYPE.COUNTRY_BUMP,
        },
      ];

      service.useBumpPackage(cart).subscribe();

      const req: TestRequest = httpMock.expectOne(BUMPS_PACKAGE_USE);
      req.flush({});

      expect(req.request.method).toEqual('POST');
    });
  });
});

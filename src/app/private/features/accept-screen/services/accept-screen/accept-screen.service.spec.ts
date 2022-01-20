import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AcceptScreenService } from './accept-screen.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import { MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { of } from 'rxjs';
import { ItemService } from '@core/item/item.service';
import { UserService } from '@core/user/user.service';
import { MockedItemService } from '@fixtures/item.fixtures.spec';
import { MOCK_USER, MOCK_OTHER_USER } from '@fixtures/user.fixtures.spec';

describe('AcceptScreenService', () => {
  let acceptScreenService: AcceptScreenService;
  let sellerRequestApiService: SellerRequestsApiService;
  let userService: UserService;
  let itemService: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AcceptScreenService,
        {
          provide: SellerRequestsApiService,
          useValue: {
            getRequestInfo() {
              return of(MOCK_SELLER_REQUEST);
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            get() {
              return of(MOCK_OTHER_USER);
            },
            getLoggedUserInformation() {
              return of(MOCK_USER);
            },
          },
        },
        { provide: ItemService, useClass: MockedItemService },
      ],
      imports: [HttpClientTestingModule],
    });
    acceptScreenService = TestBed.inject(AcceptScreenService);
    sellerRequestApiService = TestBed.inject(SellerRequestsApiService);
    userService = TestBed.inject(UserService);
    itemService = TestBed.inject(ItemService);
  });

  it('should be created', () => {
    expect(acceptScreenService).toBeTruthy();
  });

  describe('when asking to initialize the accept screen properties', () => {
    const MOCK_REQUEST_ID = 'dfsd34dss12';

    beforeEach(fakeAsync(() => {
      spyOn(sellerRequestApiService, 'getRequestInfo').and.callThrough();
      spyOn(userService, 'get').and.callThrough();
      spyOn(userService, 'getLoggedUserInformation').and.callThrough();
      spyOn(itemService, 'get').and.callThrough();

      acceptScreenService.initialize(MOCK_REQUEST_ID);
      tick();
    }));

    it('should ask server for request information', () => {
      expect(sellerRequestApiService.getRequestInfo).toHaveBeenCalledTimes(1);
      expect(sellerRequestApiService.getRequestInfo).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });

    it('should ask server for buyer information', () => {
      expect(userService.get).toHaveBeenCalledTimes(1);
      expect(userService.get).toHaveBeenCalledWith(MOCK_SELLER_REQUEST.buyer.id);
    });

    it('should ask server for seller information', () => {
      expect(userService.getLoggedUserInformation).toHaveBeenCalledTimes(1);
    });

    it('should ask server for item information', () => {
      expect(itemService.get).toHaveBeenCalledTimes(1);
      expect(itemService.get).toHaveBeenCalledWith(MOCK_SELLER_REQUEST.itemId);
    });
  });
});

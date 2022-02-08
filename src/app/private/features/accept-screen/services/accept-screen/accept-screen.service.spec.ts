import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AcceptScreenService } from './accept-screen.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import { MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { of, throwError } from 'rxjs';
import { ItemService } from '@core/item/item.service';
import { UserService } from '@core/user/user.service';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { MOCK_OTHER_USER, MOCK_USER } from '@fixtures/user.fixtures.spec';
import { AcceptScreenProperties } from '../../interfaces';
import {
  MOCK_ACCEPT_SCREEN_PROPERTIES,
  MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { CarrierDropOffModeRequestApiService } from '@api/delivery/carrier-drop-off-mode/request/carrier-drop-off-mode-request-api.service';
import { MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_FREE_AND_ONE_EURO_COST } from '@fixtures/private/delivery/accept-screen/carrier-drop-off-mode-request.fixtures.spec';
import { DeliveryAddressApiService } from '@private/features/delivery/services/api/delivery-address-api/delivery-address-api.service';
import { MOCK_DELIVERY_ADDRESS } from '@fixtures/private/delivery/delivery-address.fixtures.spec';
import { ACCEPT_SCREEN_DELIVERY_ADDRESS, ACCEPT_SCREEN_HEADER_TRANSLATIONS } from '../../constants/header-translations';
import { ACCEPT_SCREEN_ID_STEPS } from '../../constants/accept-screen-id-steps';

describe('AcceptScreenService', () => {
  const MOCK_REQUEST_ID = 'dfsd34dss12';
  let acceptScreenService: AcceptScreenService;
  let sellerRequestApiService: SellerRequestsApiService;
  let carrierDropOffModeRequestApiService: CarrierDropOffModeRequestApiService;
  let deliveryAddressApiService: DeliveryAddressApiService;
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
        {
          provide: ItemService,
          useValue: {
            get() {
              return of(MOCK_ITEM);
            },
          },
        },
        {
          provide: CarrierDropOffModeRequestApiService,
          useValue: {
            get() {
              return of(MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_FREE_AND_ONE_EURO_COST);
            },
          },
        },
        {
          provide: DeliveryAddressApiService,
          useValue: {
            get() {
              return of(MOCK_DELIVERY_ADDRESS);
            },
          },
        },
      ],
      imports: [HttpClientTestingModule],
    });
    acceptScreenService = TestBed.inject(AcceptScreenService);
    sellerRequestApiService = TestBed.inject(SellerRequestsApiService);
    carrierDropOffModeRequestApiService = TestBed.inject(CarrierDropOffModeRequestApiService);
    deliveryAddressApiService = TestBed.inject(DeliveryAddressApiService);
    userService = TestBed.inject(UserService);
    itemService = TestBed.inject(ItemService);
  });

  it('should be created', () => {
    expect(acceptScreenService).toBeTruthy();
  });

  describe('when asking the accept screen properties', () => {
    let result: AcceptScreenProperties;

    beforeEach(() => {
      spyOn(sellerRequestApiService, 'getRequestInfo').and.callThrough();
      spyOn(userService, 'get').and.callThrough();
      spyOn(userService, 'getLoggedUserInformation').and.callThrough();
      spyOn(itemService, 'get').and.callThrough();
      spyOn(carrierDropOffModeRequestApiService, 'get').and.callThrough();
    });

    describe('and the seller has delivery address defined', () => {
      beforeEach(fakeAsync(() => {
        spyOn(deliveryAddressApiService, 'get').and.callThrough();

        acceptScreenService.getAcceptScreenProperties(MOCK_REQUEST_ID).subscribe((newProperties: AcceptScreenProperties) => {
          result = newProperties;
        });
        tick();
      }));

      describe('should ask for accept screen properties', () => {
        shouldAskForAcceptScreenProperties();
      });

      it('should define the EDIT address translation', () => {
        expect(ACCEPT_SCREEN_HEADER_TRANSLATIONS[ACCEPT_SCREEN_ID_STEPS.DELIVERY_ADDRESS]).toStrictEqual(
          ACCEPT_SCREEN_DELIVERY_ADDRESS.EDIT
        );
      });

      it('should return the properties mapped', () => {
        expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(MOCK_ACCEPT_SCREEN_PROPERTIES));
      });
    });

    describe('and the seller has NOT delivery address defined', () => {
      beforeEach(fakeAsync(() => {
        spyOn(deliveryAddressApiService, 'get').and.returnValue(throwError('NON ADDRESS FOUND'));

        acceptScreenService.getAcceptScreenProperties(MOCK_REQUEST_ID).subscribe((newProperties: AcceptScreenProperties) => {
          result = newProperties;
        });
        tick();
      }));

      describe('should ask for accept screen properties', () => {
        shouldAskForAcceptScreenProperties();
      });

      it('should define the ADD address translation', () => {
        expect(ACCEPT_SCREEN_HEADER_TRANSLATIONS[ACCEPT_SCREEN_ID_STEPS.DELIVERY_ADDRESS]).toStrictEqual(
          ACCEPT_SCREEN_DELIVERY_ADDRESS.ADD
        );
      });

      it('should return the properties mapped', () => {
        expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS));
      });
    });
  });

  function shouldAskForAcceptScreenProperties() {
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

    it('should ask server for carriers information', () => {
      expect(carrierDropOffModeRequestApiService.get).toHaveBeenCalledTimes(1);
      expect(carrierDropOffModeRequestApiService.get).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });

    it('should ask server for delivery address information', () => {
      expect(deliveryAddressApiService.get).toHaveBeenCalledTimes(1);
    });
  }
});

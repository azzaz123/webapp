import { MOCK_ITEM, MOCK_ITEM_WITHOUT_IMAGE } from '@fixtures/item.fixtures.spec';
import {
  mapCarrierDropOffModeToAcceptScreenCarriers,
  mapItemToAcceptScreenItem,
  mapUserToAcceptScreenBuyer,
  mapUserToAcceptScreenSeller,
  mapDeliveryAddresstoAcceptScreenDeliveryAddress,
} from './accept-screen-properties.mapper';
import {
  MOCK_ACCEPT_SCREEN_ITEM_WITHOUT_IMAGE,
  MOCK_ACCEPT_SCREEN_ITEM,
  MOCK_ACCEPT_SCREEN_BUYER,
  MOCK_ACCEPT_SCREEN_SELLER,
  MOCK_ACCEPT_SCREEN_SELLER_WITHOUT_IMAGE,
  MOCK_ACCEPT_SCREEN_BUYER_WITHOUT_IMAGE,
  MOCK_ACCEPT_SCREEN_DELIVERY_ADDRESS,
  MOCK_ACCEPT_SCREEN_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { MOCK_USER, MOCK_OTHER_USER, MOCK_USER_WITHOUT_IMAGE, MOCK_OTHER_USER_WITHOUT_IMAGE } from '@fixtures/user.fixtures.spec';
import {
  MOCK_CARRIER_DROP_OFF_MODE_REQUEST_EMPTY,
  MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_FREE_AND_ONE_EURO_COST,
  MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_FREE_AND_ONE_HPU_WITH_SCHEDULE_DEFINED,
  MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_PO_WITH_LAST_ADDRESS_AND_ONE_HPU_WITH_SCHEDULE_DEFINED,
} from '@fixtures/private/delivery/accept-screen/carrier-drop-off-mode-request.fixtures.spec';
import {
  MOCK_DELIVERY_ADDRESS,
  MOCK_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR,
} from '@fixtures/private/delivery/delivery-address.fixtures.spec';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import {
  MOCK_ACCEPT_SCREEN_CARRIERS,
  MOCK_ACCEPT_SCREEN_CARRIERS_2,
  MOCK_ACCEPT_SCREEN_CARRIERS_FIRST_WITH_LAST_ADDRESS,
  MOCK_ACCEPT_SCREEN_CARRIERS_SECOND_WITH_SCHEDULE_DEFINED,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties-carriers.fixtures.spec';

describe('mapItemToAcceptScreenItem', () => {
  describe('when asking for item map', () => {
    describe('and item has image...', () => {
      it('should return correctly mapped item with image', () => {
        const expectedItem = mapItemToAcceptScreenItem(MOCK_ITEM);

        expect(JSON.stringify(expectedItem)).toEqual(JSON.stringify(MOCK_ACCEPT_SCREEN_ITEM));
      });
    });

    describe(`and item has NOT image...`, () => {
      it('should return correctly mapped item without image', () => {
        const expectedItem = mapItemToAcceptScreenItem(MOCK_ITEM_WITHOUT_IMAGE);

        expect(JSON.stringify(expectedItem)).toEqual(JSON.stringify(MOCK_ACCEPT_SCREEN_ITEM_WITHOUT_IMAGE));
      });
    });
  });
});

describe('mapUserToAcceptScreenSeller', () => {
  describe('when asking for seller map', () => {
    describe('and seller has image', () => {
      it('should return correctly mapped seller', () => {
        const expectedSeller = mapUserToAcceptScreenSeller(MOCK_USER);

        expect(expectedSeller).toEqual(MOCK_ACCEPT_SCREEN_SELLER);
      });
    });

    describe('and seller has NO image', () => {
      it('should return correctly mapped seller with PLACEHOLDER AVATAR', () => {
        const expectedSeller = mapUserToAcceptScreenSeller(MOCK_USER_WITHOUT_IMAGE);

        expect(expectedSeller).toEqual(MOCK_ACCEPT_SCREEN_SELLER_WITHOUT_IMAGE);
      });
    });
  });
});

describe('mapUserToAcceptScreenBuyer', () => {
  describe('when asking for buyer map', () => {
    describe('and buyer has image', () => {
      it('should return correctly mapped buyer', () => {
        const expectedBuyer = mapUserToAcceptScreenBuyer(MOCK_OTHER_USER);

        expect(expectedBuyer).toEqual(MOCK_ACCEPT_SCREEN_BUYER);
      });
    });

    describe('and buyer has NO image', () => {
      it('should return correctly mapped buyer with PLACEHOLDER AVATAR', () => {
        const expectedBuyer = mapUserToAcceptScreenBuyer(MOCK_OTHER_USER_WITHOUT_IMAGE);

        expect(expectedBuyer).toEqual(MOCK_ACCEPT_SCREEN_BUYER_WITHOUT_IMAGE);
      });
    });
  });
});

describe('mapCarrierDropOffModeToAcceptScreenCarriers', () => {
  describe('when asking for carriers map', () => {
    describe('and we have carriers defined', () => {
      describe('and the user has selected a new drop off mode', () => {
        describe('and the schedule and last address are NOT defined', () => {
          it('should return the carriers sorted by price and mapped and selected by the new drop off mode', () => {
            const expectedCarriers = mapCarrierDropOffModeToAcceptScreenCarriers(
              MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_FREE_AND_ONE_EURO_COST,
              CARRIER_DROP_OFF_MODE.HOME_PICK_UP
            );

            expect(expectedCarriers).toEqual(MOCK_ACCEPT_SCREEN_CARRIERS);
          });
        });

        describe('and one carrier is HPU', () => {
          describe('and it has tentative schedule defined', () => {
            it('should return the carrier mapped with first information defined', () => {
              const expectedCarriers = mapCarrierDropOffModeToAcceptScreenCarriers(
                MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_FREE_AND_ONE_HPU_WITH_SCHEDULE_DEFINED,
                CARRIER_DROP_OFF_MODE.POST_OFFICE
              );

              expect(expectedCarriers).toEqual(MOCK_ACCEPT_SCREEN_CARRIERS_SECOND_WITH_SCHEDULE_DEFINED);
            });
          });
        });

        describe('and one carrier is PO', () => {
          describe('and it has last address defined', () => {
            it('should return the carrier mapped with secondary information defined', () => {
              const expectedCarriers = mapCarrierDropOffModeToAcceptScreenCarriers(
                MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_PO_WITH_LAST_ADDRESS_AND_ONE_HPU_WITH_SCHEDULE_DEFINED,
                CARRIER_DROP_OFF_MODE.HOME_PICK_UP
              );

              expect(expectedCarriers).toEqual(MOCK_ACCEPT_SCREEN_CARRIERS_FIRST_WITH_LAST_ADDRESS);
            });
          });
        });
      });

      describe('and the user has NOT selected a new drop off mode', () => {
        it('should return the carriers sorted by price and mapped and selected by the cheapest one', () => {
          const expectedCarriers = mapCarrierDropOffModeToAcceptScreenCarriers(
            MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_FREE_AND_ONE_EURO_COST,
            null
          );

          expect(expectedCarriers).toEqual(MOCK_ACCEPT_SCREEN_CARRIERS_2);
        });
      });
    });

    describe(`and we DON'T have carriers defined`, () => {
      it('should NOT return any mapped value', () => {
        const expectedCarriers = mapCarrierDropOffModeToAcceptScreenCarriers(MOCK_CARRIER_DROP_OFF_MODE_REQUEST_EMPTY, null);

        expect(expectedCarriers).toEqual([]);
      });
    });
  });
});

describe('mapDeliveryAddresstoAcceptScreenDeliveryAddress', () => {
  describe('and the delivery address has flat and floor', () => {
    it('should return correctly mapped delivery address', () => {
      const expectedDeliveryAddress = mapDeliveryAddresstoAcceptScreenDeliveryAddress(MOCK_DELIVERY_ADDRESS);

      expect(expectedDeliveryAddress).toEqual(MOCK_ACCEPT_SCREEN_DELIVERY_ADDRESS);
    });
  });

  describe('and the delivery address has NOT flat and floor', () => {
    it('should return correctly mapped delivery address', () => {
      const expectedDeliveryAddress = mapDeliveryAddresstoAcceptScreenDeliveryAddress(MOCK_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR);

      expect(expectedDeliveryAddress).toEqual(MOCK_ACCEPT_SCREEN_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR);
    });
  });
});

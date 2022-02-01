import { MOCK_ITEM, MOCK_ITEM_WITHOUT_IMAGE } from '@fixtures/item.fixtures.spec';
import {
  mapCarrierDropOffModeToAcceptScreenCarriers,
  mapItemToAcceptScreenItem,
  mapUserToAcceptScreenBuyer,
  mapUserToAcceptScreenSeller,
} from './accept-screen-properties.mapper';
import {
  MOCK_ACCEPT_SCREEN_ITEM_WITHOUT_IMAGE,
  MOCK_ACCEPT_SCREEN_SELLER_WITHOUT_IMAGE,
  MOCK_ACCEPT_SCREEN_ITEM,
  MOCK_ACCEPT_SCREEN_BUYER,
  MOCK_ACCEPT_SCREEN_SELLER,
  MOCK_ACCEPT_SCREEN_SELLER_WITHOUT_ADDRESS,
  MOCK_ACCEPT_SCREEN_BUYER_WITHOUT_IMAGE,
  MOCK_ACCEPT_SCREEN_CARRIERS,
  MOCK_ACCEPT_SCREEN_SELLER_ADDRESS,
  MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_WITHOUT_FLAT_AND_FLOOR,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { MOCK_USER, MOCK_OTHER_USER, MOCK_USER_WITHOUT_IMAGE, MOCK_OTHER_USER_WITHOUT_IMAGE } from '@fixtures/user.fixtures.spec';
import { MOCK_CARRIER_DROP_OFF_MODE_REQUEST } from '@fixtures/private/delivery/accept-screen/carrier-drop-off-mode-request.fixtures.spec';
import { MOCK_DELIVERY_ADDRESS } from '@fixtures/private/delivery/delivery-address.fixtures.spec';

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
        const expectedSeller = mapUserToAcceptScreenSeller(MOCK_USER, MOCK_DELIVERY_ADDRESS);

        expect(expectedSeller).toEqual(MOCK_ACCEPT_SCREEN_SELLER);
      });
    });

    describe('and seller has NO image', () => {
      it('should return correctly mapped seller with PLACEHOLDER AVATAR', () => {
        const expectedSeller = mapUserToAcceptScreenSeller(MOCK_USER_WITHOUT_IMAGE, MOCK_DELIVERY_ADDRESS);

        expect(expectedSeller).toEqual(MOCK_ACCEPT_SCREEN_SELLER_WITHOUT_IMAGE);
      });
    });

    describe('and seller has NO address', () => {
      it('should return correctly mapped seller with empty address', () => {
        const expectedSeller = mapUserToAcceptScreenSeller(MOCK_USER, null);

        expect(expectedSeller).toEqual(MOCK_ACCEPT_SCREEN_SELLER_WITHOUT_ADDRESS);
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
    it('should return correctly mapped carriers', () => {
      const expectedCarriers = mapCarrierDropOffModeToAcceptScreenCarriers(MOCK_CARRIER_DROP_OFF_MODE_REQUEST);

      expect(expectedCarriers).toEqual(MOCK_ACCEPT_SCREEN_CARRIERS);
    });
  });
});

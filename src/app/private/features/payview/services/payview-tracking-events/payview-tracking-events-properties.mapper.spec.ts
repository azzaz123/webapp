import { ClickAddEditCard } from '@core/analytics/resources/events-interfaces/click-add-edit-card.interface';
import {
  getClickAddEditCardEventPropertiesFromPayviewState,
  getClickAddEditAddressEventPropertiesFromPayviewState,
} from './payview-tracking-events-properties.mapper';
import {
  MOCK_PAYVIEW_STATE,
  MOCK_PAYVIEW_STATE_WITHOUT_CREDIT_CARD,
  MOCK_PAYVIEW_STATE_WITHOUT_LASTADDRESSUSED,
} from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { ClickAddEditAddress } from '@core/analytics/resources/events-interfaces/click-add-edit-address.interface';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '../../modules/delivery/enums/payview-delivery-event-type.enum';
import {
  MOCK_ADD_EDIT_CARD_EVENT_WITH_ADD_ACTION,
  MOCK_ADD_EDIT_CARD_EVENT_WITH_EDIT_ACTION,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_OFFICE_AND_EDIT_ACTION,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_OFFICE_AND_ADD_ACTION,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT,
} from '@fixtures/private/delivery/payview/payview-event-properties.fixtures.spec';

describe('when mapping the payview state properties into the click add edit card event properties', () => {
  describe('and there is NO previous card', () => {
    it('should return the properties mapped with the add attribute', () => {
      const expectedProperties: ClickAddEditCard = getClickAddEditCardEventPropertiesFromPayviewState(
        MOCK_PAYVIEW_STATE_WITHOUT_CREDIT_CARD
      );
      expect(expectedProperties).toStrictEqual(MOCK_ADD_EDIT_CARD_EVENT_WITH_ADD_ACTION);
    });
  });

  describe('and there is a previous card', () => {
    it('should return the properties mapped with the edit attribute', () => {
      const expectedProperties: ClickAddEditCard = getClickAddEditCardEventPropertiesFromPayviewState(MOCK_PAYVIEW_STATE);
      expect(expectedProperties).toStrictEqual(MOCK_ADD_EDIT_CARD_EVENT_WITH_EDIT_ACTION);
    });
  });
});

describe('when mapping the payview state properties into the click add edit address event properties', () => {
  describe('and it is an address screen event type', () => {
    it('should return the properties mapped with the home and edit attribute', () => {
      const expectedProperties: ClickAddEditAddress = getClickAddEditAddressEventPropertiesFromPayviewState(
        MOCK_PAYVIEW_STATE,
        PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN
      );
      expect(expectedProperties).toStrictEqual(MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT);
    });
  });

  describe('and it is a pick up point event type with a previous picked up point', () => {
    it('should return the properties mapped with the office and edit attribute', () => {
      const expectedProperties: ClickAddEditAddress = getClickAddEditAddressEventPropertiesFromPayviewState(
        MOCK_PAYVIEW_STATE,
        PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP
      );
      expect(expectedProperties).toStrictEqual(MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_OFFICE_AND_EDIT_ACTION);
    });
  });

  describe('and it is a pick up point event type with NO previous picked up point', () => {
    it('should return the properties mapped with the office and add attribute', () => {
      const expectedProperties: ClickAddEditAddress = getClickAddEditAddressEventPropertiesFromPayviewState(
        MOCK_PAYVIEW_STATE_WITHOUT_LASTADDRESSUSED,
        PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP
      );
      expect(expectedProperties).toStrictEqual(MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_OFFICE_AND_ADD_ACTION);
    });
  });
});

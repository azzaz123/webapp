import { ClickAddEditCard } from '@core/analytics/resources/events-interfaces/click-add-edit-card.interface';
import {
  getClickAddEditCardEventPropertiesFromPayviewState,
  getClickAddEditAddressEventPropertiesFromPayviewState,
  getClickHelpTransactionalEventPropertiesFromPayviewState,
  getViewTransactionPayScreenEventPropertiesFromPayviewState,
  getClickAddPromocodeTransactionPayEventPropertiesFromPayviewState,
} from './payview-tracking-events-properties.mapper';
import {
  MOCK_PAYVIEW_STATE,
  MOCK_PAYVIEW_STATE_WITHOUT_CREDIT_CARD,
  MOCK_PAYVIEW_STATE_WITHOUT_LASTADDRESSUSED,
  MOCK_PAYVIEW_STATE_WITH_CREDIT_CARD_PREFERENCE,
  MOCK_PAYVIEW_STATE_WITH_WALLET_PREFERENCE,
  MOCK_PAYVIEW_STATE_WITH_WALLET_AND_CREDIT_CARD_PREFERENCE,
  MOCK_PAYVIEW_STATE_WITH_WALLET_AND_PAYPAL_PREFERENCE,
  MOCK_PAYVIEW_STATE_WITHOUT_DELIVERY_ADDRESS,
} from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { ClickAddEditAddress } from '@core/analytics/resources/events-interfaces/click-add-edit-address.interface';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '../../modules/delivery/enums/payview-delivery-event-type.enum';
import { ClickHelpTransactional } from '@core/analytics/resources/events-interfaces/click-help-transactional.interface';
import { ViewTransactionPayScreen } from '@core/analytics/resources/events-interfaces/view-transaction-pay-screen.interface';
import { ClickAddPromocodeTransactionPay } from '@core/analytics/resources/events-interfaces/click-add-promocode-transaction-pay.interface';
import { ClickApplyPromocodeTransactionPay } from '@core/analytics/resources/events-interfaces/click-apply-promocode-transaction-pay.interface';
import {
  MOCK_ADD_EDIT_CARD_EVENT_WITH_ADD_ACTION,
  MOCK_ADD_EDIT_CARD_EVENT_WITH_EDIT_ACTION,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_OFFICE_AND_EDIT_ACTION,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_OFFICE_AND_ADD_ACTION,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT,
  MOCK_CLICK_HELP_TRANSACTIONAL_EVENT_PROPERTIES,
  MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD,
  MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_PAYPAL,
  MOCK_CLICK_ADD_PROMOCODE_TRANSACTION_PAY,
  MOCK_CLICK_APPLY_PROMOCODE_TRANSACTION_PAY,
  MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_WALLET,
  MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_WALLET_AND_CREDIT_CARD,
  MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_WALLET_AND_PAYPAL,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_HOME_AND_ADD_ACTION,
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
  describe('and it is an address screen event type and user has delivery address', () => {
    it('should return the properties mapped with the home and edit attribute', () => {
      const expectedProperties: ClickAddEditAddress = getClickAddEditAddressEventPropertiesFromPayviewState(
        MOCK_PAYVIEW_STATE,
        PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN
      );

      expect(expectedProperties).toStrictEqual(MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT);
    });
  });

  describe('and it is an address screen event type and user does NOT have delivery address', () => {
    it('should return the properties mapped with the home and add attribute', () => {
      const expectedProperties: ClickAddEditAddress = getClickAddEditAddressEventPropertiesFromPayviewState(
        MOCK_PAYVIEW_STATE_WITHOUT_DELIVERY_ADDRESS,
        PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN
      );

      expect(expectedProperties).toStrictEqual(MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_HOME_AND_ADD_ACTION);
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

describe('when mapping the payview state properties into the click help transactional event properties', () => {
  it('should return the properties mapped', () => {
    const expectedProperties: ClickHelpTransactional = getClickHelpTransactionalEventPropertiesFromPayviewState(MOCK_PAYVIEW_STATE);

    expect(expectedProperties).toStrictEqual(MOCK_CLICK_HELP_TRANSACTIONAL_EVENT_PROPERTIES);
  });
});

describe('when mapping the payview state properties into the view transaction pay screen event properties', () => {
  describe('and the preselected payment method is paypal', () => {
    it('should return the properties mapped', () => {
      const expectedProperties: ViewTransactionPayScreen = getViewTransactionPayScreenEventPropertiesFromPayviewState(MOCK_PAYVIEW_STATE);

      expect(expectedProperties).toStrictEqual(MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_PAYPAL);
    });
  });

  describe('and the preselected payment method is credit card', () => {
    it('should return the properties mapped', () => {
      const expectedProperties: ViewTransactionPayScreen = getViewTransactionPayScreenEventPropertiesFromPayviewState(
        MOCK_PAYVIEW_STATE_WITH_CREDIT_CARD_PREFERENCE
      );

      expect(expectedProperties).toStrictEqual(MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD);
    });
  });

  describe('and the preselected payment method is wallet', () => {
    it('should return the properties mapped', () => {
      const expectedProperties: ViewTransactionPayScreen = getViewTransactionPayScreenEventPropertiesFromPayviewState(
        MOCK_PAYVIEW_STATE_WITH_WALLET_PREFERENCE
      );

      expect(expectedProperties).toStrictEqual(MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_WALLET);
    });
  });

  describe('and the preselected payment method is wallet and credit card', () => {
    it('should return the properties mapped', () => {
      const expectedProperties: ViewTransactionPayScreen = getViewTransactionPayScreenEventPropertiesFromPayviewState(
        MOCK_PAYVIEW_STATE_WITH_WALLET_AND_CREDIT_CARD_PREFERENCE
      );

      expect(expectedProperties).toStrictEqual(MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_WALLET_AND_CREDIT_CARD);
    });
  });

  describe('and the preselected payment method is wallet and paypal', () => {
    it('should return the properties mapped', () => {
      const expectedProperties: ViewTransactionPayScreen = getViewTransactionPayScreenEventPropertiesFromPayviewState(
        MOCK_PAYVIEW_STATE_WITH_WALLET_AND_PAYPAL_PREFERENCE
      );

      expect(expectedProperties).toStrictEqual(MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_WALLET_AND_PAYPAL);
    });
  });
});

describe('when mapping the payview state properties into the click add promocode transaction pay event properties', () => {
  it('should return the properties mapped', () => {
    const expectedProperties: ClickAddPromocodeTransactionPay =
      getClickAddPromocodeTransactionPayEventPropertiesFromPayviewState(MOCK_PAYVIEW_STATE);

    expect(expectedProperties).toStrictEqual(MOCK_CLICK_ADD_PROMOCODE_TRANSACTION_PAY);
  });
});

describe('when mapping the payview state properties into the click apply promocode transaction pay event properties', () => {
  it('should return the properties mapped', () => {
    const expectedProperties: ClickApplyPromocodeTransactionPay =
      getClickAddPromocodeTransactionPayEventPropertiesFromPayviewState(MOCK_PAYVIEW_STATE);

    expect(expectedProperties).toStrictEqual(MOCK_CLICK_APPLY_PROMOCODE_TRANSACTION_PAY);
  });
});

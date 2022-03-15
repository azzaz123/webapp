import {
  ClickAcceptOffer,
  ClickAddEditAddress,
  ClickHelpTransactional,
  ClickItemCard,
  ClickOtherProfile,
  ClickRejectOffer,
  ClickScheduleHPU,
  ViewAcceptOffer,
} from '@core/analytics/analytics-constants';
import {
  MOCK_CLICK_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_PO,
  MOCK_CLICK_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_PROPERTIES_WITHOUT_FULL_ADDRESS_AND_HPU,
  MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_PROPERTIES_WITH_FULL_ADDRESS_AND_PO,
  MOCK_CLICK_HELP_TRANSACTIONAL_EVENT_PROPERTIES,
  MOCK_CLICK_ITEM_CARD_EVENT_PROPERTIES,
  MOCK_CLICK_OTHER_PROFILE_EVENT_PROPERTIES,
  MOCK_CLICK_REJECT_OFFER_EVENT_PROPERTIES_WITH_PO,
  MOCK_CLICK_REJECT_OFFER_EVENT_PROPERTIES_WITH_HPU,
  MOCK_CLICK_SCHEDULE_HPU_EVENT_PROPERTIES,
  MOCK_VIEW_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_PO,
  MOCK_VIEW_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU,
} from '@fixtures/private/delivery/accept-screen/accept-screen-event-properties.fixtures.spec';
import {
  MOCK_ACCEPT_SCREEN_PROPERTIES,
  MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU,
  MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS_AND_HPU,
  MOCK_ACCEPT_SCREEN_SELLER,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import {
  getClickAcceptOfferEventPropertiesFromProperties,
  getClickAddEditAddressEventPropertiesFromProperties,
  getClickHelpTransactionalEventPropertiesFromProperties,
  getClickItemCardEventPropertiesFromProperties,
  getClickOtherProfileEventPropertiesFromSeller,
  getClickRejectOfferEventPropertiesFromProperties,
  getClickScheduleHPUEventPropertiesFromProperties,
  getViewAcceptOfferEventPropertiesFromProperties,
} from './accept-screen-tracking-events-properties.mapper';

describe('when we map the properties into click item card event properties', () => {
  it('should return the properties mapped', () => {
    const expectProperties: Partial<ClickItemCard> = getClickItemCardEventPropertiesFromProperties(MOCK_ACCEPT_SCREEN_PROPERTIES);
    expect(expectProperties).toStrictEqual(MOCK_CLICK_ITEM_CARD_EVENT_PROPERTIES);
  });
});

describe('when we map the accept screen seller into click other profile event properties', () => {
  it('should return the properties mapped', () => {
    const expectProperties: Partial<ClickOtherProfile> = getClickOtherProfileEventPropertiesFromSeller(MOCK_ACCEPT_SCREEN_SELLER);
    expect(expectProperties).toStrictEqual(MOCK_CLICK_OTHER_PROFILE_EVENT_PROPERTIES);
  });
});

describe('when we map the accept screen properties into click help transactional event properties', () => {
  it('should return the properties mapped', () => {
    const expectProperties: Partial<ClickHelpTransactional> =
      getClickHelpTransactionalEventPropertiesFromProperties(MOCK_ACCEPT_SCREEN_PROPERTIES);
    expect(expectProperties).toStrictEqual(MOCK_CLICK_HELP_TRANSACTIONAL_EVENT_PROPERTIES);
  });
});

describe('when we map the accept screen properties into view accept offer event properties', () => {
  describe('and the selected carrier is home pick up', () => {
    it('should return the properties mapped', () => {
      const expectProperties: Partial<ViewAcceptOffer> = getViewAcceptOfferEventPropertiesFromProperties(
        MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU
      );
      expect(expectProperties).toStrictEqual(MOCK_VIEW_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU);
    });
  });

  describe('and the selected carrier is post office', () => {
    it('should return the properties mapped', () => {
      const expectProperties: Partial<ViewAcceptOffer> = getViewAcceptOfferEventPropertiesFromProperties(MOCK_ACCEPT_SCREEN_PROPERTIES);
      expect(expectProperties).toStrictEqual(MOCK_VIEW_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_PO);
    });
  });
});

describe('when we map the accept screen properties into click add edit address event properties', () => {
  describe(`and seller don't have full address defined and home pick up delivery`, () => {
    it('should return the properties mapped', () => {
      const expectProperties: Partial<ClickAddEditAddress> = getClickAddEditAddressEventPropertiesFromProperties(
        MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS_AND_HPU
      );
      expect(expectProperties).toStrictEqual(MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_PROPERTIES_WITHOUT_FULL_ADDRESS_AND_HPU);
    });
  });

  describe('and seller has full address defined and post office delivery', () => {
    it('should return the properties mapped', () => {
      const expectProperties: Partial<ClickAddEditAddress> =
        getClickAddEditAddressEventPropertiesFromProperties(MOCK_ACCEPT_SCREEN_PROPERTIES);
      expect(expectProperties).toStrictEqual(MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_PROPERTIES_WITH_FULL_ADDRESS_AND_PO);
    });
  });
});

describe('and we map the accept screen properties into click schedule HPU event properties', () => {
  it('should return the properties mapped', () => {
    const expectProperties: Partial<ClickScheduleHPU> = getClickScheduleHPUEventPropertiesFromProperties(MOCK_ACCEPT_SCREEN_PROPERTIES);
    expect(expectProperties).toStrictEqual(MOCK_CLICK_SCHEDULE_HPU_EVENT_PROPERTIES);
  });
});

describe('and we map the accept screen properties into click accept offer event properties', () => {
  describe('and the selected carrier is post office', () => {
    it('should return the properties mapped', () => {
      const expectProperties: Partial<ClickAcceptOffer> = getClickAcceptOfferEventPropertiesFromProperties(MOCK_ACCEPT_SCREEN_PROPERTIES);
      expect(expectProperties).toStrictEqual(MOCK_CLICK_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_PO);
    });
  });

  describe('and the selected carrier is home pick up', () => {
    it('should return the properties mapped', () => {
      const expectProperties: Partial<ClickAcceptOffer> = getClickAcceptOfferEventPropertiesFromProperties(
        MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU
      );
      expect(expectProperties).toStrictEqual(MOCK_CLICK_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU);
    });
  });
});

describe('and we map the accept screen properties into click reject offer event properties', () => {
  describe('and the selected carrier is post office', () => {
    it('should return the properties mapped', () => {
      const expectProperties: Partial<ClickRejectOffer> = getClickRejectOfferEventPropertiesFromProperties(MOCK_ACCEPT_SCREEN_PROPERTIES);
      expect(expectProperties).toStrictEqual(MOCK_CLICK_REJECT_OFFER_EVENT_PROPERTIES_WITH_PO);
    });
  });

  describe('and the selected carrier is home pick up', () => {
    it('should return the properties mapped', () => {
      const expectProperties: Partial<ClickRejectOffer> = getClickRejectOfferEventPropertiesFromProperties(
        MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU
      );
      expect(expectProperties).toStrictEqual(MOCK_CLICK_REJECT_OFFER_EVENT_PROPERTIES_WITH_HPU);
    });
  });
});

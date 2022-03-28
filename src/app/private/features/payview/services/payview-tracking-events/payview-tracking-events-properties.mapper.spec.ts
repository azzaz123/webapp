import { ClickAddEditCard } from '@core/analytics/resources/events-interfaces/click-add-edit-card.interface';
import { getClickAddEditCardEventPropertiesFromPayviewState } from './payview-tracking-events-properties.mapper';
import { MOCK_PAYVIEW_STATE, MOCK_PAYVIEW_STATE_WITHOUT_CREDIT_CARD } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import {
  MOCK_ADD_EDIT_CARD_EVENT_WITH_ADD_ACTION,
  MOCK_ADD_EDIT_CARD_EVENT_WITH_EDIT_ACTION,
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

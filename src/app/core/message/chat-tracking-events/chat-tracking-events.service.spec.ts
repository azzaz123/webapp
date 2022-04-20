import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  AnalyticsEvent,
  SendFirstMessage,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { SearchIdService } from '@core/analytics/search/search-id/search-id.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE } from '@fixtures/chat/inbox.fixtures.spec';
import { ChatTrackingEventsService } from './chat-tracking-events.service';

describe('ChatTrackingEventsService', () => {
  let service: ChatTrackingEventsService;
  let analyticsService: AnalyticsService;
  let searchIdService: SearchIdService;

  const inboxConversation = CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatTrackingEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }, SearchIdService],
    });
    service = TestBed.inject(ChatTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
    searchIdService = TestBed.inject(SearchIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when user sends first message', () => {
    it('should send the Send First Message event', () => {
      const expectedEvent: AnalyticsEvent<SendFirstMessage> = {
        name: ANALYTICS_EVENT_NAMES.SendFirstMessage,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          itemId: inboxConversation.item.id,
          sellerUserId: inboxConversation.user.id,
          conversationId: inboxConversation.id,
          searchId: searchIdService.getSearchIdByItemId(inboxConversation.item.id),
          screenId: SCREEN_IDS.Chat,
          categoryId: inboxConversation.item.categoryId,
          country: analyticsService.market,
          language: analyticsService.appLocale,
          shippingAllowed: null,
        },
      };

      spyOn(analyticsService, 'trackEvent');

      service.trackSendFirstMessage(inboxConversation);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });

    it('should ask for related search id', () => {
      spyOn(searchIdService, 'getSearchIdByItemId');

      service.trackSendFirstMessage(inboxConversation);

      expect(searchIdService.getSearchIdByItemId).toHaveBeenCalledWith(inboxConversation.item.id);
    });
  });
});

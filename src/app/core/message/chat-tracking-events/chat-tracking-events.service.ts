import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
  SendFirstMessage,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { SearchIdService } from '@core/analytics/search/search-id/search-id.service';
import { InboxConversation } from '@private/features/chat/core/model';

@Injectable()
export class ChatTrackingEventsService {
  constructor(private analyticsService: AnalyticsService, private searchIdService: SearchIdService) {}

  public trackSendFirstMessage(conversation: InboxConversation) {
    const event: AnalyticsEvent<SendFirstMessage> = {
      name: ANALYTICS_EVENT_NAMES.SendFirstMessage,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        itemId: conversation.item.id,
        sellerUserId: conversation.user.id,
        searchId: this.searchIdService.getSearchIdByItemId(conversation.item.id),
        conversationId: conversation.id,
        screenId: SCREEN_IDS.Chat,
        categoryId: conversation.item.categoryId,
        country: this.analyticsService.market,
        language: this.analyticsService.appLocale,
        shippingAllowed: null,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}

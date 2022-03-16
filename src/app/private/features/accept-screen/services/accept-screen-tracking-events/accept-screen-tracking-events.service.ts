import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickAcceptOffer,
  ClickAddEditAddress,
  ClickHelpTransactional,
  ClickItemCard,
  ClickOtherProfile,
  ClickRejectOffer,
  ClickScheduleHPU,
  SCREEN_IDS,
  ViewAcceptOffer,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable({
  providedIn: 'root',
})
export class AcceptScreenTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackViewAcceptOffer(payload: Partial<ViewAcceptOffer>): void {
    const { itemId, buyerUserId, requestId, categoryId, isPro, totalPrice, offeredPrice, itemPrice, title, method, buyerCountry } = payload;
    const pageViewEvent: AnalyticsPageView<ViewAcceptOffer> = {
      name: ANALYTICS_EVENT_NAMES.ViewAcceptOffer,
      attributes: {
        itemId,
        buyerUserId,
        requestId,
        categoryId,
        isPro,
        totalPrice,
        offeredPrice,
        itemPrice,
        title,
        method,
        buyerCountry,
        screenId: SCREEN_IDS.AcceptOffer,
      },
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public async trackClickItemCard(payload: Partial<ClickItemCard>): Promise<void> {
    const { itemId, categoryId, salePrice, isCarDealer, isPro, sellerUserId, sellerRating, title, shippingAllowed } = payload;
    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        itemId,
        categoryId,
        title,
        salePrice,
        isPro,
        isCarDealer,
        position: 0,
        sellerUserId,
        shippingAllowed,
        sellerRating,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickOtherProfile(payload: Partial<ClickOtherProfile>): void {
    const { isPro, sellerUserId } = payload;
    const event: AnalyticsEvent<ClickOtherProfile> = {
      name: ANALYTICS_EVENT_NAMES.ClickOtherProfile,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        isPro,
        sellerUserId,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickAcceptOffer(payload: Partial<ClickAcceptOffer>): void {
    const { itemId, buyerUserId, requestId, categoryId, isPro, totalPrice, offeredPrice, itemPrice, title, method } = payload;
    const event: AnalyticsEvent<ClickAcceptOffer> = {
      name: ANALYTICS_EVENT_NAMES.ClickAcceptOffer,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        itemId,
        buyerUserId,
        requestId,
        categoryId,
        isPro,
        totalPrice,
        offeredPrice,
        itemPrice,
        title,
        method,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickRejectOffer(payload: Partial<ClickRejectOffer>): void {
    const { itemId, buyerUserId, requestId, categoryId, isPro, totalPrice, offeredPrice, itemPrice, title, method } = payload;
    const event: AnalyticsEvent<ClickRejectOffer> = {
      name: ANALYTICS_EVENT_NAMES.ClickRejectOffer,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        itemId,
        buyerUserId,
        requestId,
        categoryId,
        isPro,
        totalPrice,
        offeredPrice,
        itemPrice,
        title,
        method,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickAddEditAddress(payload: Partial<ClickAddEditAddress>): void {
    const { addOrEdit, addressType, requestId, itemId, itemPrice } = payload;
    const event: AnalyticsEvent<ClickAddEditAddress> = {
      name: ANALYTICS_EVENT_NAMES.ClickAddEditAddress,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        addOrEdit,
        addressType,
        requestId,
        itemId,
        itemPrice,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickHelpTransactional(payload: Partial<ClickHelpTransactional>): void {
    const { itemId, categoryId, itemPrice, sellerUserId, helpName } = payload;
    const event: AnalyticsEvent<ClickHelpTransactional> = {
      name: ANALYTICS_EVENT_NAMES.ClickHelpTransactional,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        itemId,
        categoryId,
        itemPrice,
        sellerUserId,
        helpName,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickScheduleHPU(payload: Partial<ClickScheduleHPU>): void {
    const { itemId, buyerUserId, requestId, categoryId, totalPrice, offeredPrice, itemPrice, title } = payload;
    const event: AnalyticsEvent<ClickScheduleHPU> = {
      name: ANALYTICS_EVENT_NAMES.ClickScheduleHPU,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        itemId,
        buyerUserId,
        requestId,
        categoryId,
        totalPrice,
        offeredPrice,
        itemPrice,
        title,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}

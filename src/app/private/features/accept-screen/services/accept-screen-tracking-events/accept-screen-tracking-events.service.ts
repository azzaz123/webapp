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

  public trackViewAcceptOffer(payload: ViewAcceptOffer): void {
    const pageViewEvent: AnalyticsPageView<ViewAcceptOffer> = {
      name: ANALYTICS_EVENT_NAMES.ViewAcceptOffer,
      attributes: {
        itemId: payload.itemId,
        buyerUserId: payload.buyerUserId,
        requestId: payload.requestId,
        categoryId: payload.categoryId,
        isPro: payload.isPro,
        totalPrice: payload.totalPrice,
        offeredPrice: payload.offeredPrice,
        itemPrice: payload.itemPrice,
        title: payload.title,
        method: payload.method,
        buyerCountry: payload.buyerCountry,
        screenId: SCREEN_IDS.AcceptOffer,
      },
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public trackClickItemCard(itemCardDetails: ClickItemCard): void {
    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        itemId: itemCardDetails.itemId,
        categoryId: itemCardDetails.categoryId,
        title: itemCardDetails.title,
        salePrice: itemCardDetails.salePrice,
        isPro: itemCardDetails.isPro,
        isCarDealer: itemCardDetails.isCarDealer,
        position: 0,
        sellerUserId: itemCardDetails.sellerUserId,
        shippingAllowed: true,
        sellerRating: itemCardDetails.sellerRating,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickOtherProfile(profileDetails: ClickOtherProfile): void {
    const event: AnalyticsEvent<ClickOtherProfile> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        isPro: profileDetails.isPro,
        sellerUserId: profileDetails.sellerUserId,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickAcceptOffer(payload: ClickAcceptOffer): void {
    const event: AnalyticsEvent<ClickAcceptOffer> = {
      name: ANALYTICS_EVENT_NAMES.ClickAcceptOffer,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        itemId: payload.itemId,
        buyerUserId: payload.buyerUserId,
        requestId: payload.requestId,
        categoryId: payload.categoryId,
        isPro: payload.isPro,
        totalPrice: payload.totalPrice,
        offeredPrice: payload.offeredPrice,
        itemPrice: payload.itemPrice,
        title: payload.title,
        method: payload.method,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickRejectOffer(payload: ClickRejectOffer): void {
    const event: AnalyticsEvent<ClickRejectOffer> = {
      name: ANALYTICS_EVENT_NAMES.ClickRejectOffer,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: payload.itemId,
        buyerUserId: payload.buyerUserId,
        requestId: payload.requestId,
        categoryId: payload.categoryId,
        isPro: payload.isPro,
        totalPrice: payload.totalPrice,
        offeredPrice: payload.offeredPrice,
        itemPrice: payload.itemPrice,
        title: payload.title,
        screenId: SCREEN_IDS.AcceptOffer,
        method: payload.method,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickAddEditAddress(payload: ClickAddEditAddress): void {
    const event: AnalyticsEvent<ClickAddEditAddress> = {
      name: ANALYTICS_EVENT_NAMES.ClickAddEditAddress,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        addOrEdit: payload.addOrEdit,
        addressType: payload.addressType,
        requestId: payload.requestId,
        itemId: payload.itemId,
        itemPrice: payload.itemPrice,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickHelpTransactional(payload: ClickHelpTransactional): void {
    const event: AnalyticsEvent<ClickHelpTransactional> = {
      name: ANALYTICS_EVENT_NAMES.ClickHelpTransactional,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        itemId: payload.itemId,
        categoryId: payload.categoryId,
        itemPrice: payload.itemPrice,
        sellerUserId: payload.sellerUserId,
        helpName: payload.helpName,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickScheduleHPU(payload: ClickScheduleHPU): void {
    const event: AnalyticsEvent<ClickScheduleHPU> = {
      name: ANALYTICS_EVENT_NAMES.ClickScheduleHPU,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.AcceptOffer,
        itemId: payload.itemId,
        buyerUserId: payload.buyerUserId,
        requestId: payload.requestId,
        categoryId: payload.categoryId,
        totalPrice: payload.totalPrice,
        offeredPrice: payload.offeredPrice,
        itemPrice: payload.itemPrice,
        title: payload.title,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}

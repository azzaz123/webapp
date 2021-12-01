import { Injector } from '@angular/core';

import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';
import {
  TransactionTrackingActionAnalyticsModel,
  TransactionTrackingActionDeeplink,
  TransactionTrackingActionDetailAnalytics,
} from '@api/core/model/delivery/transaction/tracking';
import {
  TransactionTrackingActionDetailDto,
  TransactionTrackingActionDetailPayloadDeeplinkDto,
  TransactionTrackingActionDetailPayloadDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export class TransactionTrackingActionDeeplinkModel implements TransactionTrackingActionDeeplink {
  public analytics?: TransactionTrackingActionDetailAnalytics;
  public isDeeplink: boolean = true;
  public linkUrl: string;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    if (!!actionDetailDto.analytics) {
      this.analytics = new TransactionTrackingActionAnalyticsModel(actionDetailDto.analytics);
    }
    this.linkUrl = this.getLinkUrl(actionDetailDto.payload);
  }

  private getLinkUrl(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDeeplinkDto).link_url ?? undefined;
  }
}

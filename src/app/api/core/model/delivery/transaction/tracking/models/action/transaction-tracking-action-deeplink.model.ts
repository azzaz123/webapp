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

  private deeplinkService: DeeplinkService;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    if (!!actionDetailDto.analytics) {
      this.analytics = new TransactionTrackingActionAnalyticsModel(actionDetailDto.analytics);
    }
    this.createDeeplinkService();
    this.linkUrl = this.getLinkUrl(actionDetailDto.payload);
  }

  private createDeeplinkService(): void {
    const injector = Injector.create({
      providers: [{ provide: DeeplinkService }],
    });

    this.deeplinkService = injector.get(DeeplinkService);
  }

  private getLinkUrl(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (
      this.deeplinkService.toWebLink((actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDeeplinkDto).link_url) ?? undefined
    );
  }
}

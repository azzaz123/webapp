import {
  TransactionTrackingActionAnalyticsModel,
  TransactionTrackingActionCarrierTrackingWebview,
  TransactionTrackingActionDetailAnalytics,
} from '@api/core/model/delivery/transaction/tracking';
import {
  TransactionTrackingActionDetailDto,
  TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto,
  TransactionTrackingActionDetailPayloadDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export class TransactionTrackingActionCarrierTrackingWebviewModel implements TransactionTrackingActionCarrierTrackingWebview {
  public analytics?: TransactionTrackingActionDetailAnalytics;
  public isCarrierTrackingWebview: boolean = true;
  public linkUrl: string;
  public title: string;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    if (!!actionDetailDto.analytics) {
      this.analytics = new TransactionTrackingActionAnalyticsModel(actionDetailDto.analytics);
    }
    this.linkUrl = this.getLinkUrl(actionDetailDto.payload);
    this.title = this.getTitle(actionDetailDto.payload);
  }

  private getLinkUrl(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto).link_url ?? undefined;
  }
  private getTitle(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto).title ?? undefined;
  }
}

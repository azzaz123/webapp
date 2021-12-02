import {
  TransactionTrackingActionAnalyticsModel,
  TransactionTrackingActionDetailAnalytics,
  TransactionTrackingActionDialog,
  TransactionTrackingActionNegative,
  TransactionTrackingActionNegativeModel,
  TransactionTrackingActionPositive,
  TransactionTrackingActionPositiveModel,
} from '@api/core/model/delivery/transaction/tracking';
import {
  TransactionTrackingActionDetailDto,
  TransactionTrackingActionDetailPayloadDialogDto,
  TransactionTrackingActionDetailPayloadDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export class TransactionTrackingActionDialogModel implements TransactionTrackingActionDialog {
  public analytics?: TransactionTrackingActionDetailAnalytics;
  public description: string;
  public isDialog: boolean = true;
  public negative: TransactionTrackingActionNegative;
  public positive: TransactionTrackingActionPositive;
  public title: string;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    if (!!actionDetailDto.analytics) {
      this.analytics = new TransactionTrackingActionAnalyticsModel(actionDetailDto.analytics);
    }
    this.description = this.getDescription(actionDetailDto.payload);
    this.negative = this.getNegative(actionDetailDto.payload);
    this.positive = this.getPositive(actionDetailDto.payload);
    this.title = this.getTitle(actionDetailDto.payload);
  }

  private getDescription(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto).description_text ?? undefined;
  }

  private getNegative(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): TransactionTrackingActionNegative {
    const payload = actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto;
    return !!payload.negative ? new TransactionTrackingActionNegativeModel(payload.negative.title) : undefined;
  }

  private getPositive(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): TransactionTrackingActionPositive {
    const payload = actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto;
    return !!payload.positive ? new TransactionTrackingActionPositiveModel(payload.positive.title, payload.positive.action) : undefined;
  }

  private getTitle(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto).title_text ?? undefined;
  }
}

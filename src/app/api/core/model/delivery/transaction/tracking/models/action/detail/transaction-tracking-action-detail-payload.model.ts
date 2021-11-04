import { TransactionTrackingActionDetailPayloadDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import {
  TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto,
  TransactionTrackingActionDetailPayloadDialogDto,
  TransactionTrackingActionDetailPayloadUserActionDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-payload-dtos.interface';
import {
  TransactionTrackingActionDetail,
  TransactionTrackingActionDetailPayload,
  TransactionTrackingActionDetailPayloadBanner,
  TransactionTrackingActionDetailPayloadConfirmation,
  TransactionTrackingActionDetailPayloadParameters,
} from '../../../interfaces/transaction-tracking-action-detail.interface';
import { TransactionTrackingActionDetailPayloadBannerModel } from './transaction-tracking-action-detail-payload-banner.model';
import { TransactionTrackingActionDetailPayloadConfirmationModel } from './transaction-tracking-action-detail-payload-confirmation.model';

export class TransactionTrackingActionDetailPayloadModel implements TransactionTrackingActionDetailPayload {
  banner: TransactionTrackingActionDetailPayloadBanner;
  description: string;
  linkUrl: string;
  name: string;
  negative: TransactionTrackingActionDetailPayloadConfirmation;
  parameters: TransactionTrackingActionDetailPayloadParameters;
  positive: TransactionTrackingActionDetailPayloadConfirmation;
  success: TransactionTrackingActionDetail;
  title: string;

  constructor(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto) {
    this.banner = new TransactionTrackingActionDetailPayloadBannerModel(
      actionDetailPayloadDto as TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto
    );
    this.description = this.getDescription(actionDetailPayloadDto);
    this.linkUrl = this.getLinkUrl(actionDetailPayloadDto);
    this.name = this.getName(actionDetailPayloadDto);
    this.negative = new TransactionTrackingActionDetailPayloadConfirmationModel(
      actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto
    );
    this.parameters = new TransactionTrackingActionDetailPayloadParametersModel(
      actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto
    );
  }

  private getDescription(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto).description_text;
  }
  private getLinkUrl(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto).link_url;
  }
  private getName(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto).name;
  }
  private getTitleText(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto).title_text;
  }
}

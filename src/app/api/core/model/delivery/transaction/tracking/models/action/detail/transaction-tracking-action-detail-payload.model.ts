import { TransactionTrackingActionDetailPayloadDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import {
  TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto,
  TransactionTrackingActionDetailPayloadDeeplinkDto,
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
import { TransactionTrackingActionDetailPayloadParametersModel } from './transaction-tracking-action-detail-payload-parameters.model';
import { TransactionTrackingActionDetailModel } from './transaction-tracking-action-detail.model';

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

  constructor(private actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto) {
    this.banner = this.getBanner();
    this.description = this.getDescription();
    this.linkUrl = this.getLinkUrl();
    this.name = this.getName();
    this.negative = this.getNegative();
    this.parameters = this.getParameters();
    this.positive = this.getPositive();
    this.success = this.getSuccess();
    this.title = this.getTitleFromCarrierTrackingWebview() || this.getTitleFromDialog();
  }

  private getBanner(): TransactionTrackingActionDetailPayloadBannerModel {
    const payload = this.actionDetailPayloadDto as TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto;
    return !!payload.banner ? new TransactionTrackingActionDetailPayloadBannerModel(payload) : null;
  }
  private getDescription(): string {
    return (this.actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto).description_text ?? null;
  }
  private getLinkUrl(): string {
    return (this.actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDeeplinkDto).link_url ?? null;
  }
  private getName(): string {
    return (this.actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto).name ?? null;
  }
  private getNegative(): TransactionTrackingActionDetailPayloadConfirmationModel {
    const payload = this.actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto;
    return !!payload.negative ? new TransactionTrackingActionDetailPayloadConfirmationModel(payload.negative.title) : null;
  }
  private getParameters(): TransactionTrackingActionDetailPayloadParametersModel {
    const payload = this.actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto;
    return !!payload ? new TransactionTrackingActionDetailPayloadParametersModel(payload) : null;
  }
  private getPositive(): TransactionTrackingActionDetailPayloadConfirmationModel {
    const payload = this.actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto;
    return !!payload.positive
      ? new TransactionTrackingActionDetailPayloadConfirmationModel(payload.positive.title, payload.positive.action)
      : null;
  }
  private getSuccess(): TransactionTrackingActionDetailModel {
    const payload = this.actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto;
    return !!payload.on_success ? new TransactionTrackingActionDetailModel(payload.on_success) : null;
  }
  private getTitleFromCarrierTrackingWebview(): string {
    return (this.actionDetailPayloadDto as TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto).title ?? null;
  }
  private getTitleFromDialog(): string {
    return (this.actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto).title_text ?? null;
  }
}

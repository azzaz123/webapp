import { TransactionTrackingActionDetailPayloadDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import {
  TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto,
  TransactionTrackingActionDetailPayloadDeeplinkDto,
  TransactionTrackingActionDetailPayloadDialogDto,
  TransactionTrackingActionDetailPayloadUserActionDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-payload-dtos.interface';
import { APP_LOCALE } from '@configs/subdomains.config';
import { CUSTOMER_HELP_SITE_BASE } from '@core/external-links/customer-help/enums/customer-help-site.enum';
import { HELP_LOCALE } from '@core/external-links/customer-help/types/help-locale';
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

  constructor(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto) {
    this.banner = this.getBanner(actionDetailPayloadDto);
    this.description = this.getDescription(actionDetailPayloadDto);
    this.linkUrl = this.getLinkUrl(actionDetailPayloadDto);
    this.name = this.getName(actionDetailPayloadDto);
    this.negative = this.getNegative(actionDetailPayloadDto);
    this.parameters = this.getParameters(actionDetailPayloadDto);
    this.positive = this.getPositive(actionDetailPayloadDto);
    this.success = this.getSuccess(actionDetailPayloadDto);
    this.title = this.getTitleFromCarrierTrackingWebview(actionDetailPayloadDto) || this.getTitleFromDialog(actionDetailPayloadDto);
  }

  public getArticleUrl(locale: HELP_LOCALE): string {
    const regExp: RegExp = new RegExp(/[?&]z=([^&]+).*$/);
    const matches = this.linkUrl.match(regExp);
    if (!!matches && matches.length >= 0 && matches[0].length >= 4) {
      const article: string = matches[0].substring(3);
      return `${CUSTOMER_HELP_SITE_BASE.DEFAULT}${locale}/articles/${article}`;
    }
    return null;
  }
  private getBanner(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): TransactionTrackingActionDetailPayloadBannerModel {
    const payload = actionDetailPayloadDto as TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto;
    return !!payload.banner ? new TransactionTrackingActionDetailPayloadBannerModel(payload) : undefined;
  }
  private getDescription(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto).description_text ?? undefined;
  }
  private getLinkUrl(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDeeplinkDto).link_url ?? undefined;
  }
  private getName(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto).name ?? undefined;
  }
  private getNegative(
    actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto
  ): TransactionTrackingActionDetailPayloadConfirmationModel {
    const payload = actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto;
    return !!payload.negative ? new TransactionTrackingActionDetailPayloadConfirmationModel(payload.negative.title) : undefined;
  }
  private getParameters(
    actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto
  ): TransactionTrackingActionDetailPayloadParametersModel {
    const payload = actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto;
    return !!payload.parameters ? new TransactionTrackingActionDetailPayloadParametersModel(payload) : undefined;
  }
  private getPositive(
    actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto
  ): TransactionTrackingActionDetailPayloadConfirmationModel {
    const payload = actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto;
    return !!payload.positive
      ? new TransactionTrackingActionDetailPayloadConfirmationModel(payload.positive.title, payload.positive.action)
      : undefined;
  }
  private getSuccess(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): TransactionTrackingActionDetailModel {
    const payload = actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto;
    return !!payload.on_success ? new TransactionTrackingActionDetailModel(payload.on_success) : undefined;
  }
  private getTitleFromCarrierTrackingWebview(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto).title ?? undefined;
  }
  private getTitleFromDialog(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadDialogDto).title_text ?? undefined;
  }
}

import { IOption } from '@shared/dropdown/utils/option.interface';
import { KYCNationalityAnalytics } from '../../modals/kyc/services/kyc-tracking-events/kyc-tracking-events.type';

export interface KYCNationality extends IOption {
  headerText: string;
  svgPath: string;
  availableDocuments: IOption[];
  analyticsName: KYCNationalityAnalytics;
}

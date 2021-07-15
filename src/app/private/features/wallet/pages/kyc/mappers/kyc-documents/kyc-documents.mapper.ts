import { IOption } from '@shared/dropdown/utils/option.interface';
import { KYC_DOCUMENTATION, KYC_DOCUMENTATION_TYPE } from '../../constants/kyc-documentation-constants';
import { KYC_NATIONALITY_TYPE } from '../../constants/kyc-nationalities-constants';

export function getKYCAvailableDocuments(KYC_NATIONALITY: KYC_NATIONALITY_TYPE): IOption[] {
  if (KYC_NATIONALITY === KYC_NATIONALITY_TYPE.EUROPEAN_UNION) {
    return KYC_DOCUMENTATION;
  }

  if (KYC_NATIONALITY === KYC_NATIONALITY_TYPE.UK_USA_CANADA) {
    return KYC_DOCUMENTATION.filter(
      (document) => document.value === KYC_DOCUMENTATION_TYPE.PASSPORT || document.value === KYC_DOCUMENTATION_TYPE.DRIVING_LICENSE
    );
  }

  if (KYC_NATIONALITY === KYC_NATIONALITY_TYPE.OTHER) {
    return KYC_DOCUMENTATION.filter((document) => document.value === KYC_DOCUMENTATION_TYPE.PASSPORT);
  }
}

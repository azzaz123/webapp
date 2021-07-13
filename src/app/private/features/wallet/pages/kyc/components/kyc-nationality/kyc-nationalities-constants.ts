import {
  KYCNationality,
  KYC_DOCUMENTATION_TYPE,
  KYC_NATIONALITY_TYPE,
} from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { IOption } from '@shared/dropdown/utils/option.interface';

const KYC_DOCUMENTATION: IOption[] = [
  {
    value: KYC_DOCUMENTATION_TYPE.PASSPORT,
    label: $localize`:@@kyc_select_document_view_list_passport_placeholder:Passport`,
  },
  {
    value: KYC_DOCUMENTATION_TYPE.RESIDENCE_PERMIT,
    label: $localize`:@@kyc_select_document_view_list_residence_permit_placeholder:Residence permit`,
  },
  {
    value: KYC_DOCUMENTATION_TYPE.DRIVING_LICENSE,
    label: $localize`:@@kyc_select_document_view_list_driving_license_placeholder:Driving license`,
  },
  {
    value: KYC_DOCUMENTATION_TYPE.ID,
    label: $localize`:@@kyc_select_document_view_list_id_placeholder:National Identification Document`,
  },
];

export const KYC_NATIONALITIES: KYCNationality[] = [
  {
    label: $localize`:@@kyc_select_nationality_view_list_eu_placeholder:European Union`,
    value: KYC_NATIONALITY_TYPE.EUROPEAN_UNION,
    svgPath: '/assets/icons/wallet/kyc/stepper/european_nationality.svg',
    availableDocuments: getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.EUROPEAN_UNION),
  },
  {
    label: $localize`:@@kyc_select_nationality_view_list_uk_usa_can_placeholdera:UK, USA or Canada`,
    value: KYC_NATIONALITY_TYPE.UK_USA_CANADA,
    svgPath: '/assets/icons/wallet/kyc/stepper/ukusaca_nationality.svg',
    availableDocuments: getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.UK_USA_CANADA),
  },
  {
    label: $localize`:@@kyc_select_nationality_view_list_other_place_placeholder:Rest of the world`,
    value: KYC_NATIONALITY_TYPE.OTHER,
    svgPath: '/assets/icons/wallet/kyc/stepper/world_nationality.svg',
    availableDocuments: getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.OTHER),
  },
];

function getKYCAvailableDocuments(KYC_NATIONALITY: KYC_NATIONALITY_TYPE): IOption[] {
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

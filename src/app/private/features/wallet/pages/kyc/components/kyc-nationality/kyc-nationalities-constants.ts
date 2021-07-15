import {
  KYCDocumentation,
  KYCNationality,
  KYC_DOCUMENTATION_TYPE,
  KYC_NATIONALITY_TYPE,
} from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { IOption } from '@shared/dropdown/utils/option.interface';

export const KYC_DOCUMENTATION: KYCDocumentation[] = [
  {
    value: KYC_DOCUMENTATION_TYPE.ID,
    label: $localize`:@@kyc_select_document_view_list_id_placeholder:National Identification Document`,
    photosNeeded: 2,
  },
  {
    value: KYC_DOCUMENTATION_TYPE.DRIVING_LICENSE,
    label: $localize`:@@kyc_select_document_view_list_driving_license_placeholder:Driving license`,
    photosNeeded: 1,
  },
  {
    value: KYC_DOCUMENTATION_TYPE.PASSPORT,
    label: $localize`:@@kyc_select_document_view_list_passport_placeholder:Passport`,
    photosNeeded: 1,
  },
  {
    value: KYC_DOCUMENTATION_TYPE.RESIDENCE_PERMIT,
    label: $localize`:@@kyc_select_document_view_list_residence_permit_placeholder:Residence permit`,
    photosNeeded: 1,
  },
];

export const KYC_NATIONALITIES: KYCNationality[] = [
  {
    label: $localize`:@@kyc_select_nationality_view_list_eu_placeholder:European Union`,
    title: $localize`:@@kyc_select_document_view_if_eu_top bar_title:European Union`,
    value: KYC_NATIONALITY_TYPE.EUROPEAN_UNION,
    svgPath: '/assets/icons/wallet/kyc/stepper/european_nationality.svg',
    availableDocuments: getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.EUROPEAN_UNION),
  },
  {
    label: $localize`:@@kyc_select_nationality_view_list_uk_usa_can_placeholdera:UK, USA or Canada`,
    title: $localize`:@@kyc_select_document_view_if_usa_uk_can_top bar_title:UK, USA or Canada`,
    value: KYC_NATIONALITY_TYPE.UK_USA_CANADA,
    svgPath: '/assets/icons/wallet/kyc/stepper/ukusaca_nationality.svg',
    availableDocuments: getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.UK_USA_CANADA),
  },
  {
    label: $localize`:@@kyc_select_nationality_view_list_other_place_placeholder:Rest of the world`,
    title: $localize`:@@kyc_select_document_view_if_rest_of_the_world_top bar_title:Rest of the world`,
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

import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { getKYCAvailableDocuments } from '../mappers/kyc-documents/kyc-documents.mapper';

export enum KYC_NATIONALITY_TYPE {
  EUROPEAN_UNION = 'EUROPEAN_UNION',
  UK_USA_CANADA = 'UK_USA_CANADA',
  OTHER = 'OTHER',
}

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

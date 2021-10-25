import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { KYC_NATIONALITY_TYPE } from '../enums/kyc-nationality-type.enum';
import { getKYCAvailableDocuments } from '../mappers/kyc-documents/kyc-documents.mapper';

export const KYC_NATIONALITIES: KYCNationality[] = [
  {
    label: $localize`:@@kyc_select_nationality_view_list_eu_placeholder:European Union`,
    headerText: $localize`:@@kyc_select_document_view_if_eu_top_bar_title:European Union`,
    value: KYC_NATIONALITY_TYPE.EUROPEAN_UNION,
    svgPath: '/assets/icons/wallet/kyc/stepper/european_nationality.svg',
    availableDocuments: getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.EUROPEAN_UNION),
    analyticsName: 'european_community',
  },
  {
    label: $localize`:@@kyc_select_nationality_view_list_uk_usa_can_placeholder:UK, USA or Canada`,
    headerText: $localize`:@@kyc_select_document_view_if_usa_uk_can_top_bar_title:UK, USA or Canada`,
    value: KYC_NATIONALITY_TYPE.UK_USA_CANADA,
    svgPath: '/assets/icons/wallet/kyc/stepper/ukusaca_nationality.svg',
    availableDocuments: getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.UK_USA_CANADA),
    analyticsName: 'usa_uk_and_canada',
  },
  {
    label: $localize`:@@kyc_select_nationality_view_list_other_place_placeholder:Rest of the world`,
    headerText: $localize`:@@kyc_select_document_view_if_rest_of_the_world_top_bar_title:Rest of the world`,
    value: KYC_NATIONALITY_TYPE.OTHER,
    svgPath: '/assets/icons/wallet/kyc/stepper/world_nationality.svg',
    availableDocuments: getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.OTHER),
    analyticsName: 'rest_of_the_world',
  },
];

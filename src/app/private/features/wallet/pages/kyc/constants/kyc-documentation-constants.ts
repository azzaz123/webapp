import { KYCDocumentation } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';

export enum KYC_DOCUMENTATION_TYPE {
  ID = 'ID',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  PASSPORT = 'PASSPORT',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
}

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

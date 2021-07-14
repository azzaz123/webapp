import { IOption } from '@shared/dropdown/utils/option.interface';

export interface KYCNationality extends IOption {
  title: string;
  svgPath: string;
  availableDocuments: IOption[];
}

export enum KYC_NATIONALITY_TYPE {
  EUROPEAN_UNION = 'EUROPEAN_UNION',
  UK_USA_CANADA = 'UK_USA_CANADA',
  OTHER = 'OTHER',
}

export enum KYC_DOCUMENTATION_TYPE {
  ID = 'ID',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  PASSPORT = 'PASSPORT',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
}

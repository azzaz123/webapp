import { IOption } from '@shared/dropdown/utils/option.interface';

export interface KYCNationality extends IOption {
  headerText: string;
  svgPath: string;
  availableDocuments: IOption[];
}

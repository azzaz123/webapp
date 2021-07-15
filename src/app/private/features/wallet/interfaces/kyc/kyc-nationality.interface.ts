import { IOption } from '@shared/dropdown/utils/option.interface';

export interface KYCNationality extends IOption {
  title: string;
  svgPath: string;
  availableDocuments: IOption[];
}

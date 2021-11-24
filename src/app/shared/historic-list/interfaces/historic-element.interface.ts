import { Money } from '@api/core/model/money.interface';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '../enums/historic-element-subdescription-type.enum';

export interface HistoricElement<T = string> {
  id: T;
  imageUrl: string;
  iconUrl?: string;
  title: string;
  description: string;
  subDescription?: {
    text: string;
    type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE;
  };
  moneyAmount: Money;
}

import { Money } from '@api/core/model/money.interface';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '../enums/historic-element-subdescription-type.enum';
import { HistoricElementId } from '../types/historic-element-id.type';

export interface HistoricElement<T = Object> {
  id: HistoricElementId;
  imageUrl: string;
  iconUrl: string;
  title: string;
  description: {
    text: string;
    iconUrl?: string;
  };
  subDescription?: {
    text: string;
    type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE;
  };
  moneyAmount: Money;
  payload?: T;
}

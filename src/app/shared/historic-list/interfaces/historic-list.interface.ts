import { Money } from '@api/core/model/money.interface';
import { HistoricDateElement } from './historic-date-element.interface';
import { HistoricListHeader } from './historic-list-header.interface';

export interface HistoricList extends HistoricDateElement<HistoricListHeader> {
  totalBalance?: Money;
}

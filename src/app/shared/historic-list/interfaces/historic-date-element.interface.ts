import { HistoricElement } from './historic-element.interface';
import { HistoricListHeader } from './historic-list-header.interface';
import { HistoricListSubtitle } from './historic-list-subtitle.interface';

export interface HistoricDateElement<T = HistoricElement | HistoricListSubtitle | HistoricListHeader> {
  label?: string;
  elements: T[];
}

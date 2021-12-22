import { HistoricDateElement } from './historic-date-element.interface';
import { HistoricElement, HistoricElementTransaction } from './historic-element.interface';

export interface HistoricListSubtitle extends HistoricDateElement<HistoricElement | HistoricElementTransaction> {}

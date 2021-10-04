import { HistoricList } from '../interfaces/historic-list.interface';
import {
  MOCK_HISTORIC_ELEMENT,
  MOCK_HISTORIC_ELEMENT_WITH_ICON,
  MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION,
} from './historic-element.fixtures.spec';

export const MOCK_HISTORIC_LIST_EMPTY: HistoricList = {
  elements: [],
};

export const MOCK_HISTORIC_LIST: HistoricList = {
  elements: [
    {
      label: '2021',
      elements: [
        {
          label: 'September',
          elements: [MOCK_HISTORIC_ELEMENT, MOCK_HISTORIC_ELEMENT_WITH_ICON, MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION],
        },
      ],
    },
  ],
};

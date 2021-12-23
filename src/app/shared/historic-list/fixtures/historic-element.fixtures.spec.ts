import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { PendingTransaction } from '@api/core/model';
import { Request } from '@api/core/model/delivery';
import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/model/delivery/pending-transactions-fixtures.spec';
import { MOCK_PENDING_REQUEST } from '@api/fixtures/core/model/delivery/requests.fixtures.spec';
import { environment } from '@environments/environment';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '../enums/historic-element-subdescription-type.enum';
import { HistoricElement } from '../interfaces/historic-element.interface';

export const MOCK_HISTORIC_ELEMENT: HistoricElement = {
  id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
  imageUrl: 'path/to/image/melenaalex.jpg',
  iconUrl: `${environment.baseUrl}path/to/icon/thumbsup.svg`,
  title: 'Melena Alejandro',
  description: {
    text: 'Sale - 30 Sep',
  },
  moneyAmount: mapNumberAndCurrencyCodeToMoney({ number: 12, currency: 'EUR' }),
};

export const MOCK_HISTORIC_ELEMENT_WITH_ICON_IN_DESCRIPTION: HistoricElement = {
  ...MOCK_HISTORIC_ELEMENT,
  description: {
    text: 'Sale - 30 Sep',
    iconUrl: 'path/to/icon/thumbsup.svg',
  },
};

export const MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION: HistoricElement = {
  ...MOCK_HISTORIC_ELEMENT,
  subDescription: {
    text: 'In your bank before 1 Oct',
    type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.NORMAL,
  },
};

export const MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION_VALID: HistoricElement = {
  ...MOCK_HISTORIC_ELEMENT,
  subDescription: {
    text: 'In your bank before 1 Oct',
    type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.VALID,
  },
};

export const MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION_ERROR: HistoricElement = {
  ...MOCK_HISTORIC_ELEMENT,
  subDescription: {
    text: 'In your bank before 1 Oct',
    type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.ERROR,
  },
};

export const MOCK_HISTORIC_ELEMENT_SALE: HistoricElement = {
  id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
  imageUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  iconUrl: 'assets/icons/money-in.svg',
  title: 'Muñeca reborn',
  description: {
    text: 'Sale · 16 Sep',
  },
  moneyAmount: mapNumberAndCurrencyCodeToMoney({ number: 420, currency: 'EUR' }),
};

export const MOCK_HISTORIC_ELEMENT_CASHOUT: HistoricElement = {
  id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
  imageUrl: 'assets/images/bank.svg',
  iconUrl: 'assets/icons/money-out.svg',
  title: 'ES91••••1332',
  description: {
    text: 'Withdrawal · 17 Sep',
  },
  moneyAmount: mapNumberAndCurrencyCodeToMoney({ number: -288, currency: 'EUR' }),
};

export const MOCK_HISTORIC_ELEMENT_CASHOUT_WITH_ESTIMATED_PAYOUT: HistoricElement = {
  id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
  imageUrl: 'assets/images/bank.svg',
  iconUrl: 'assets/icons/money-out.svg',
  title: 'ES91••••1332',
  description: {
    text: 'Withdrawal · 17 Sep',
  },
  moneyAmount: mapNumberAndCurrencyCodeToMoney({ number: -288, currency: 'EUR' }),
  subDescription: {
    text: 'In your bank before 22 Sep',
    type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.NORMAL,
  },
};

export const MOCK_HISTORIC_ELEMENT_WITH_ID: HistoricElement<PendingTransaction> = {
  ...MOCK_HISTORIC_ELEMENT,
  id: '1337',
  payload: MOCK_PENDING_TRANSACTIONS[0],
};

export const MOCK_HISTORIC_ELEMENT_REQUEST_WITH_ID: HistoricElement<Request> = {
  ...MOCK_HISTORIC_ELEMENT,
  id: '13333353537',
  payload: MOCK_PENDING_REQUEST,
};

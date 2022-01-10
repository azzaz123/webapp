import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { HistoricTransaction } from '@api/core/model';
import { Request } from '@api/core/model/delivery';
import { DeliveryPendingTransaction } from '@api/core/model/delivery/transaction/delivery-pending-transaction.interface';
import { MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_BUYER } from '@api/fixtures/core/model/delivery/deliveries/ongoing/delivery-pending-transactions-and-requests.fixtures.spec';
import { MOCK_PENDING_REQUEST_AS_BUYER, MOCK_PENDING_REQUEST_AS_SELLER } from '@api/fixtures/core/model/delivery/requests.fixtures.spec';
import { MOCK_HISTORIC_TRANSACTIONS } from '@api/fixtures/core/model/delivery/transaction/historic-transaction.fixtures.spec';
import { environment } from '@environments/environment';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
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

export const MOCK_HISTORIC_ELEMENT_WITH_DELIVERY_PENDING_TRANSACTION: HistoricElement<DeliveryPendingTransaction> = {
  ...MOCK_HISTORIC_ELEMENT,
  id: '1337',
  payload: MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_BUYER.transactions[0],
};

export const MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_BUYER: HistoricElement<Request> = {
  ...MOCK_HISTORIC_ELEMENT,
  id: '13333353537',
  payload: MOCK_PENDING_REQUEST_AS_BUYER,
};

export const MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_SELLER: HistoricElement<Request> = {
  ...MOCK_HISTORIC_ELEMENT,
  id: '13333353537',
  payload: MOCK_PENDING_REQUEST_AS_SELLER,
};

export const MOCK_HISTORIC_ELEMENT_WITH_HISTORIC_TRANSACTION: HistoricElement<HistoricTransaction> = {
  id: '3b7560cc-b4f8-48bf-ba27-4d070952b3e8',
  imageUrl: MOCK_ITEM.images[0].urls_by_size.original,
  iconUrl: MOCK_USER.image.urls_by_size.original,
  title: MOCK_ITEM.title,
  description: {
    text: 'Via shipping',
    iconUrl: 'assets/icons/box.svg',
  },
  subDescription: {
    text: 'Completed on 22 Oct',
    type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.NORMAL,
  },
  moneyAmount: mapNumberAndCurrencyCodeToMoney({ number: 19.75, currency: 'EUR' }),
  payload: MOCK_HISTORIC_TRANSACTIONS[0],
};

import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { Request } from '@api/core/model/delivery/request.interface';
import { DELIVERY_ONGOING_STATES } from '@api/core/model/delivery/transaction/delivery-status/delivery-ongoing-states.enum';
import { DELIVERY_ONGOING_STATUS } from '@api/core/model/delivery/transaction/delivery-status/delivery-ongoing-status.enum';

export const MOCK_PENDING_REQUEST_AS_BUYER: Request = {
  id: '81891bfa-9df3-41f9-9411-0cd85d1daf9e',
  item: {
    id: 'kmzn9dmg4kjn',
    imageUrl: 'http://cdn-beta.wallapop.com/images/10420/34/ow/__/c10420p189278801/i420098101.jpg?pictureSize=W800',
    title: 'REQUEST - CURRENT USER IS THE BUYER',
  },
  buyer: {
    id: 'mxzo7qgdvlj9',
    imageUrl: 'http://cdn-beta.wallapop.com/images/13/19/ok/__/c13p76729033/i420346101.jpg?pictureSize=W800',
    name: 'Generisius M.',
  },
  seller: {
    id: 'npj9v2o98m6e',
    imageUrl: 'http://cdn-beta.wallapop.com/images/13/1a/7c/__/c13p77605037/i419166102.jpg?pictureSize=W800',
    name: 'Dimasiado P.',
  },
  moneyAmount: mapNumberAndCurrencyCodeToMoney({ number: 3, currency: 'EUR' }),
  isCurrentUserTheSeller: false,
  state: DELIVERY_ONGOING_STATES.REQUEST_CREATED,
  status: {
    name: DELIVERY_ONGOING_STATUS.REQUEST_CREATED,
    translation: 'abc',
  },
};

export const MOCK_PENDING_REQUEST_AS_SELLER: Request = { ...MOCK_PENDING_REQUEST_AS_BUYER, isCurrentUserTheSeller: true };

import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { Request } from '@api/core/model/delivery/request.interface';

export const MOCK_PENDING_REQUEST: Request = {
  id: '81891bfa-9df3-41f9-9411-0cd85d1daf9e',
  item: {
    id: 'kmzn9dmg4kjn',
    imageUrl: 'http://cdn-beta.wallapop.com/images/10420/34/ow/__/c10420p189278801/i420098101.jpg?pictureSize=W800',
    title: 'Laia testing beta',
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
};

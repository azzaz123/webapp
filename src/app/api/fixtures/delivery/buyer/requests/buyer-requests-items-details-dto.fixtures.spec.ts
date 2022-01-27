import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { BuyerRequestsItemsDetailsDto } from '@api/delivery/buyer/requests/dtos/buyer-requests-items-details-dto.interface';

export const MOCK_BUYER_REQUESTS_ITEMS_DETAILS_DTO: BuyerRequestsItemsDetailsDto = {
  category_id: 1,
  item_hash: 'abc1234',
  picture_url: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  price: {
    amount: 100,
    currency: 'EUR',
  },
  seller_country: 'ES',
  seller_user_hash: 'abc1234',
  title: 'AltavocesABC',
};

export const MOCK_BUYER_REQUESTS_ITEMS_DETAILS: BuyerRequestsItemsDetails = {
  categoryId: 1,
  itemHash: 'abc1234',
  pictureUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  price: {
    amount: { integer: 100, decimals: 0, total: 100.0 },
    currency: { code: 'EUR', symbol: '€' },
  },
  sellerCountry: 'ES',
  sellerUserHash: 'abc1234',
  title: 'AltavocesABC',
};

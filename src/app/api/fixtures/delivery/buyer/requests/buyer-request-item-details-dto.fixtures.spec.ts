import { BuyerRequestItemDetailsDto } from '@api/delivery/buyer/requests/dtos/buyer-request-item-details-dto.interface';

export const MOCK_BUYER_REQUEST_ITEM_DETAILS_DTO: BuyerRequestItemDetailsDto = {
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

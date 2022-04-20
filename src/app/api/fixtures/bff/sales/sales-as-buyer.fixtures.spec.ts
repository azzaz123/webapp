import { SalesAsBuyerDto } from '@api/bff/delivery/sales/dtos/sales-as-buyer-dto.interface';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';

export const MOCK_SALES_AS_BUYER_DTO: SalesAsBuyerDto = {
  next_page: 3,
  sales: [
    {
      cost_amount: 1.0,
      cost_currency: 'EUR',
      finished_at: 1642613155,
      id: '3030584b-5b78-440c-a8e1-594dae4fc1d2',
      item: {
        hash: 'mzng4gdmmk6n',
        id: MOCK_ITEM.id,
        image_url: 'http://cdn-beta.wallapop.com/images/10420/36/4l/__/c10420p191690801/i424298102.jpg?pictureSize=W640',
        title: MOCK_ITEM.title,
      },
      transaction_status: 'SUCCEEDED',
      type: 'SHIPPING',
      user: {
        hash: '8x6qk33gvq6y',
        id: MOCK_USER.id,
        image_url: 'https://cdn-beta.wallapop.com/images/13/08/1e/__/c13p13502190/i25963616.jpg?pictureSize=W800',
      },
    },
    {
      cost_amount: 14.0,
      cost_currency: 'EUR',
      finished_at: 1642613155,
      id: '3030584b-5b78-440c-a8e1-594dae4fc7dax',
      item: {
        hash: '0j2w9wq54rjy',
        id: '191570811',
        image_url: 'http://cdn-beta.wallapop.com/images/10420/36/4l/__/c10420p191690801/i424298102.jpg?pictureSize=W640',
        title: 'fsdfd',
      },
      transaction_status: 'SUCCEEDED',
      type: 'F2F',
      user: {
        hash: '8x6qk33gvq6y',
        id: MOCK_USER.id,
        image_url: 'https://cdn-beta.wallapop.com/images/13/08/1e/__/c13p13502190/i25963616.jpg?pictureSize=W800',
      },
    },
  ],
};

import { InboxPriceApi } from './inbox-price-api';

export class InboxItemApi {
  hash: string;
  title: string;
  status: string;
  image_url: string;
  price: InboxPriceApi;
  slug: string;
  is_mine: boolean;
  category_id: number;
}

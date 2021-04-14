import { SearchBaseItemResponse } from '../models/search-base-item.response';

export interface SearchCustomerGoodsResponse extends SearchBaseItemResponse {
    description: string;
    free_shipping: boolean;
    shipping_allowed: boolean;
    seller_id: string;
}

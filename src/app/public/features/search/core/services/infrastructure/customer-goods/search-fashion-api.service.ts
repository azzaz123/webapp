import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { SearchResponse } from '../api/search-response.interface';
import { SearchAPIService } from '../api/search-api.service';
import { SearchCustomerGoodsResponse } from './search-costumer-goods-response.interface';

@Injectable()
export class SearchFashionApiService extends SearchAPIService<SearchCustomerGoodsResponse> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'fashion');
  }

  protected searchResponseMapper({search_objects}: SearchResponse<SearchCustomerGoodsResponse>): SearchItem[] {
    return search_objects.map((item: SearchCustomerGoodsResponse) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      currency: item.currency,
      images: item.images.map(({small}) => small),
      flags: {
        favourited: false,
        reserved: item.flags.reserved,
        bumped: item.visibility_flags.bumped
      }
    } as SearchItem));
  }
}

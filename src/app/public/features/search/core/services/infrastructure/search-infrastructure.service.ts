import { Injectable } from '@angular/core';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Observable } from 'rxjs';
import { SearchPagination } from '../../../interfaces/search-pagination.interface';
import { SearchAPIService } from './api/search-api.service';
import { SearchCarsApiService } from './cars/search-cars-api.service';
import { SearchCustomerGoodsApiService } from './customer-goods/search-customer-goods-api.service';
import { SearchFashionApiService } from './customer-goods/search-fashion-api.service';
import { SearchRealEstateApiService } from './real_estate/search-real-estate-api.service';

@Injectable()
export class SearchInfrastructureService {

  private searchAPIMap: Map<number, SearchAPIService> = new Map();
  private customCategories: Set<number> = new Set([CATEGORY_IDS.CAR, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.FASHION_ACCESSORIES]);
  private categoryActive: number | null = null;

  constructor(
    private searchCarsApiService: SearchCarsApiService,
    private searchCustomerGoodsApiService: SearchCustomerGoodsApiService,
    private searchFashionApiService: SearchFashionApiService,
    private searchRealEstateApiService: SearchRealEstateApiService
  ) {
    this.searchAPIMap.set(CATEGORY_IDS.CAR, this.searchCarsApiService);
    this.searchAPIMap.set(CATEGORY_IDS.REAL_ESTATE, this.searchRealEstateApiService);
    this.searchAPIMap.set(CATEGORY_IDS.FASHION_ACCESSORIES, this.searchFashionApiService);
    this.searchAPIMap.set(null, this.searchCustomerGoodsApiService);
  }

  search(params: FilterParameter[]): Observable<SearchPagination> {
    const paramCategoryId: FilterParameter = params.find(({key}: FilterParameter) => key === 'category_ids');
    const categoryId: number = +paramCategoryId.value;
    const categoryMap: number | null = this.customCategories.has(categoryId) ? categoryId : null;

    const service: SearchAPIService = this.searchAPIMap.get(categoryMap);
    return service.search(params);
  }

  loadMore(): Observable<SearchPagination> {
    const service: SearchAPIService = this.searchAPIMap.get(this.categoryActive);
    return service.loadMore();
  }
}

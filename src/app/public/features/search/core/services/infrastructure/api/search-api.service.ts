import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { SORT_BY } from '@public/features/search/components/sort-filter/services/constants/sort-by-options-constants';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SearchPagination } from '../../../../interfaces/search-pagination.interface';
import { FILTER_PARAMETERS_SEARCH } from '../../constants/filter-parameters';
import { SEARCH_ITEMS_MINIMAL_LENGTH } from '../../constants/search-item-max';
import { ItemCardMapper, SearchApiItemMapperFactory } from './search-api-item-mapper.factory';
import { SearchApiUrlFactory, SearchApiUrlSearchOrWall } from './search-api-url.factory';
import { SearchResponse } from './search-response.interface';

export const NEXT_HEADER_PAGE = 'X-NextPage';
export const SEARCH_ID = 'x-wallapop-search-id';

@Injectable()
export class SearchAPIService {
  private static readonly BASE_URL: string = `${environment.baseUrl}api/v3`;
  private nextPageUrl: string | null = null;
  private categoryId: string | null = null;
  private searchId: string | null = null;
  private order: SORT_BY | null = null;
  private bubble: string | null = null;

  protected static buildNextPageUrl(url: string, nextPage: string): string {
    return nextPage && url.split('?')[0] + '?' + nextPage;
  }

  protected static hasToLoadMoreItems({ items, hasMore }: SearchPagination): boolean {
    return items.length < SEARCH_ITEMS_MINIMAL_LENGTH && hasMore;
  }

  constructor(protected httpClient: HttpClient) {}

  public loadMore(): Observable<SearchPagination> {
    return this.nextPageUrl ? this.makeSearchApi(this.nextPageUrl) : of(null);
  }

  public search(params: FilterParameter[]): Observable<SearchPagination> {
    this.nextPageUrl = null;
    const paramCategoryId: FilterParameter = params.find(({ key }: FilterParameter) => key === FILTER_PARAMETERS_SEARCH.CATEGORY_ID);
    this.categoryId = paramCategoryId?.value;
    let url = `/${SearchApiUrlFactory(this.categoryId)}/${SearchApiUrlSearchOrWall(params)}`;
    let httpParams: HttpParams = new HttpParams();
    params.forEach(({ key, value }: FilterParameter) => (httpParams = httpParams.set(key, value)));
    url += '?' + httpParams.toString();
    return this.makeSearchApi(url);
  }

  private makeSearchApi<T>(url: string, cacheItems: ItemCard[] = []): Observable<SearchPagination> {
    return this.httpClient
      .get<SearchResponse<T>>(SearchAPIService.BASE_URL + url, { observe: 'response' })
      .pipe(
        tap(({ headers, body }: HttpResponse<SearchResponse<T>>) => {
          const nextPage: string = headers.get(NEXT_HEADER_PAGE);
          this.searchId = headers.get(SEARCH_ID);
          this.order = body.order;
          this.bubble = body.bubble;
          this.nextPageUrl = SearchAPIService.buildNextPageUrl(url, nextPage);
        }),
        map(({ body }: HttpResponse<SearchResponse<T>>) => {
          const mapper: ItemCardMapper<T> = SearchApiItemMapperFactory(this.categoryId);
          return cacheItems.concat(mapper(body));
        }),
        map((items: ItemCard[]) => ({
          items,
          hasMore: !!this.nextPageUrl,
          searchId: this.searchId,
          sortBy: this.order,
          bubble: this.bubble,
        })),
        switchMap((search: SearchPagination) =>
          SearchAPIService.hasToLoadMoreItems(search) ? this.makeSearchApi(this.nextPageUrl, search.items) : of(search)
        )
      );
  }
}

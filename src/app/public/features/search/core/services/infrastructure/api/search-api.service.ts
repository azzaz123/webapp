import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SearchPagination } from '../../../../interfaces/search-pagination.interface';
import { FILTER_PARAMETERS_SEARCH } from '../../constants/filter-parameters';
import { SEARCH_ITEMS_MINIMAL_LENGTH } from '../../constants/search-item-max';
import { SearchApiItemMapperFactory, SearchItemMapper } from './search-api-item-mapper.factory';
import { SearchApiUrlFactory, SearchApiUrlSearchOrWall } from './search-api-url.factory';
import { SearchResponse } from './search-response.interface';

export const NEXT_HEADER_PAGE = 'X-NextPage';

@Injectable()
export class SearchAPIService {
  private static readonly BASE_URL: string = '/api/v3';
  private nextPageUrl: string | null = null;
  private categoryId: string | null = null;

  protected static buildNextPageUrl(url: string, nextPage: string): string {
    return nextPage && url.split('?')[0] + '?' + nextPage;
  }

  protected static hasToLoadMoreItems({items, hasMore}: SearchPagination): boolean {
    return items.length < SEARCH_ITEMS_MINIMAL_LENGTH && hasMore;
  }

  constructor(protected httpClient: HttpClient) {}

  public loadMore(): Observable<SearchPagination> {
    return this.nextPageUrl ? this.makeSearchApi(this.nextPageUrl) : of(null);
  }

  public search(params: FilterParameter[]): Observable<SearchPagination> {
    this.nextPageUrl = null;

    const paramCategoryId: FilterParameter = params.find(({key}: FilterParameter) => key === FILTER_PARAMETERS_SEARCH.CATEGORY_ID);
    this.categoryId = paramCategoryId?.value;
    let url = `/${SearchApiUrlFactory(this.categoryId)}/${SearchApiUrlSearchOrWall(params)}`;

    let httpParams: HttpParams = new HttpParams();
    params.forEach(({key, value}: FilterParameter) => httpParams = httpParams.set(key, value));
    url += '?' + httpParams.toString();
    return this.makeSearchApi(url);
  }

  private makeSearchApi<T>(url: string, cacheItems: SearchItem[] = []): Observable<SearchPagination> {
    return this.httpClient.get<SearchResponse<T>>(SearchAPIService.BASE_URL + url, {observe: 'response'}).pipe(
      tap(({headers}: HttpResponse<SearchResponse<T>>) => {
        const nextPage: string = headers.get(NEXT_HEADER_PAGE);
        this.nextPageUrl = SearchAPIService.buildNextPageUrl(url, nextPage);
      }),
      map(({body}: HttpResponse<SearchResponse<T>>) => {
        const mapper: SearchItemMapper<T> = SearchApiItemMapperFactory(this.categoryId);
        return cacheItems.concat(mapper(body));
      }),
      map((items: SearchItem[]) => ({
        items,
        hasMore: !!this.nextPageUrl
      })),
      switchMap((search: SearchPagination) =>
        SearchAPIService.hasToLoadMoreItems(search) ? this.makeSearchApi(this.nextPageUrl, search.items) : of(search))
    );
  }

}

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SearchPagination } from '../../../../interfaces/search-pagination.interface';
import { SEARCH_ITEMS_MINIMAL_LENGTH } from '../../constants/search-item-max';
import { SearchApiUrlSearchOrWall } from './search-api-url.factory';
import { SearchResponse } from './search-response.interface';

const NEXT_HEADER_PAGE = 'X-NextPage';

export abstract class SearchAPIService<T = any> {
  private static readonly BASE_URL: string = '/api/v3/cars/';
  private nextPageUrl: string = null;

  protected static buildNextPageUrl(url: string, nextPage: string): string {
    return nextPage && url.split('?')[0] + '?' + nextPage;
  }

  protected static hasToLoadMoreItems({items, hasMore}: SearchPagination): boolean {
    return items.length < SEARCH_ITEMS_MINIMAL_LENGTH && hasMore;
  }

  constructor(protected httpClient: HttpClient, private endpoint: string) {}

  public loadMore(): Observable<SearchPagination> {
    return this.nextPageUrl ? this.makeSearchApi(this.nextPageUrl) : of(null);
  }

  public search(params: FilterParameter[]): Observable<SearchPagination> {
    this.nextPageUrl = null;

    const paramCategoryId: FilterParameter = params.find(({key}: FilterParameter) => key === 'category_ids');
    let url = `/${this.endpoint}/${SearchApiUrlSearchOrWall(params)}`;

    let httpParams: HttpParams = new HttpParams();
    params.forEach(({key, value}: FilterParameter) => httpParams = httpParams.set(key, value));
    url += '?' + httpParams.toString();
    return this.makeSearchApi(url);
  }

  protected makeSearchApi(url: string, cacheItems: SearchItem[] = []): Observable<SearchPagination> {
    return this.httpClient.get<SearchResponse<T>>(SearchAPIService.BASE_URL + url, {observe: 'response'}).pipe(
      tap(({headers}: HttpResponse<SearchResponse<T>>) => {
        const nextPage: string = headers.get(NEXT_HEADER_PAGE);
        this.nextPageUrl = SearchAPIService.buildNextPageUrl(url, nextPage);
      }),
      map(({body}: HttpResponse<SearchResponse<T>>) => ({
        items: cacheItems.concat(this.searchResponseMapper(body)),
        hasMore: !!this.nextPageUrl
      })),
      switchMap((search: SearchPagination) =>
        SearchAPIService.hasToLoadMoreItems(search) ? this.makeSearchApi(this.nextPageUrl, search.items) : of(search))
    );
  }

  protected abstract searchResponseMapper(response: SearchResponse<T>): SearchItem[];
}

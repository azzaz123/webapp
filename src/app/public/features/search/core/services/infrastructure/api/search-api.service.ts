import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchPagination } from '@public/features/search/interfaces/search-pagination.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SearchApiUrlFactory, SearchApiUrlSearchOrWall } from './search-api-url.factory';
import { SearchResponse, SearchResponseMapper } from '../search-response.interface';

export const NEXT_HEADER_PAGE = 'X-NextPage';

@Injectable()
export class SearchApiService {

  private static BASE_URL = '/api/v3';

  constructor(private httpClient: HttpClient) {
  }

  private nextPageUrl: string = null;

  private static buildNextPageUrl(url: string, nextPage: string): string {
    return nextPage && url.split('?')[0] + '?' + nextPage;
  }

  public search(params: FilterParameter[]): Observable<SearchPagination> {
    this.nextPageUrl = null;

    const paramCategoryId: FilterParameter = params.find(({key}: FilterParameter) => key === 'category_ids');
    let url = `/${SearchApiUrlFactory(paramCategoryId?.value)}/${SearchApiUrlSearchOrWall(params)}`;

    let httpParams: HttpParams = new HttpParams();
    params.forEach(({key, value}: FilterParameter) => httpParams = httpParams.set(key, value));
    url += '?' + httpParams.toString();
    return this.makeSearchApi(url);
  }

  public loadMore(): Observable<SearchPagination> {
    return this.makeSearchApi(this.nextPageUrl);
  }

  private makeSearchApi(url: string): Observable<SearchPagination> {
    return this.httpClient.get<SearchResponse>(SearchApiService.BASE_URL + url, {observe: 'response'}).pipe(
      tap(({headers}: HttpResponse<SearchResponse>) => {
        const nextPage: string = headers.get(NEXT_HEADER_PAGE);
        this.nextPageUrl = SearchApiService.buildNextPageUrl(url, nextPage);
      }),
      map(({body}: HttpResponse<SearchResponse>) => ({
        items: SearchResponseMapper(body),
        hasMore: !!this.nextPageUrl
      }))
    );
  }
}

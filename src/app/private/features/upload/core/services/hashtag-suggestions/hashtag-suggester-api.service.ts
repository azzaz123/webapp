import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedList } from '@api/core/model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HashtagResponse, Hashtag } from '../../models/hashtag.interface';

export const HASHTAG_SUGGESTERS_API = `api/v3/suggesters/hashtags`;
export const GENERAL_HASHTAG_SUGGESTERS_API = `${HASHTAG_SUGGESTERS_API}/general`;

@Injectable()
export class HashtagSuggesterApiService {
  private readonly nextPageHeaderName = 'x-nextpage';
  private readonly nextPageParameterName = 'start';

  constructor(private http: HttpClient) {}

  public getHashtagsByPrefix(category_id: string, prefix: string): Observable<PaginatedList<Hashtag>> {
    const url = `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}`;
    const httpParams: HttpParams = new HttpParams({ fromObject: { category_id, prefix } });
    return this.getResults(this.http.get<HttpResponse<HashtagResponse>>(url, { params: httpParams, observe: 'response' as 'body' }));
  }

  public getHashtags(category_id: string, start: string): Observable<PaginatedList<Hashtag>> {
    const url = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, start } });
    return this.getResults(this.http.get<HttpResponse<HashtagResponse>>(url, { params: httpParams, observe: 'response' as 'body' }));
  }

  private getResults(endpointSubscribable: Observable<HttpResponse<HashtagResponse>>): Observable<PaginatedList<Hashtag>> {
    return endpointSubscribable.pipe(
      map((r: HttpResponse<HashtagResponse>) => {
        const nextPage: string = r.headers.get(this.nextPageHeaderName);
        return {
          list: r.body.hashtags,
          paginationParameter: new URLSearchParams(nextPage).get(this.nextPageParameterName),
        };
      })
    );
  }
}

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HashtagSuggester, HashtagSuggesterResponse } from '../../models/hashtag-suggester.interface';
import { MOCK_HASHTAG_SUGGESTERS } from '../../../../../../../tests/hashtag-suggester.fixtures.spec';
//import { MOCK_HASHTAG_SUGGESTERS } from '@fixtures/hashtag-suggester.fixtures.spec';

export const HASHTAG_SUGGESTERS_API = `api/v3/suggesters/hashtags`;
export const GENERAL_HASHTAG_SUGGESTERS_API = `${HASHTAG_SUGGESTERS_API}/general`;

@Injectable()
export class HashtagSuggestionsService {
  public readonly suggestors: HashtagSuggester[] = [];
  constructor(private http: HttpClient) {}

  private getHashTagSuggesters(category_id: string, start: string, prefix?: string): Observable<HashtagSuggesterResponse> {
    const url = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, prefix, start } });
    return this.http.get<HashtagSuggesterResponse>(url, { params: httpParams });
  }

  private getGeneralHashTagSuggesters(
    category_id: string,
    start: string,
    prefix?: string
  ): Observable<HttpResponse<HashtagSuggesterResponse>> {
    const url = `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, prefix, start } });
    return this.http.get<HashtagSuggesterResponse>(url, { params: httpParams, observe: 'response' });
  }

  public loadHashtagSugessters(categoryId: number, prefix?: string, page: number = 0): Observable<HashtagSuggester[]> {
    const category_id = categoryId.toString();
    const start = page.toString();
    return this.getHashTagSuggesters(category_id, start, prefix).pipe(
      map((hashTagResponse: HashtagSuggesterResponse) => {
        return hashTagResponse.hashtags;
      })
    );
  }

  public loadGeneralHashtagSugessters(categoryId: number, prefix?: string, page: number = 0): Observable<HashtagSuggester[]> {
    const category_id = categoryId.toString();
    const start = page.toString();
    return this.getGeneralHashTagSuggesters(category_id, start, prefix).pipe(
      map((response) => {
        const nextPage = response.headers.get('x-nextpage');
        console.log('nextpage header', nextPage);
        return response.body.hashtags;
      })
    );
  }
}

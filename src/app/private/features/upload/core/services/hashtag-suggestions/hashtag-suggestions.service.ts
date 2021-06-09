import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HashtagSuggester, HashtagSuggesterResponse } from '../../models/hashtag-suggester.interface';

export const HASHTAG_SUGGESTERS_API = `api/v3/suggesters/hashtags`;
export const GENERAL_HASHTAG_SUGGESTERS_API = `${HASHTAG_SUGGESTERS_API}/general`;

@Injectable()
export class HashtagSuggestionsService {
  constructor(private http: HttpClient) {}

  private getHashTagSuggesters(
    category_id: string,
    start: string,
    isGernalHashTag: boolean,
    prefix?: string
  ): Observable<HttpResponse<HashtagSuggesterResponse>> {
    const url = isGernalHashTag
      ? `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}`
      : `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, prefix, start } });
    return this.http.get<HashtagSuggesterResponse>(url, { params: httpParams, observe: 'response' });
  }

  public loadHashtagSugessters(
    categoryId: number,
    isGernalHashTag: boolean,
    prefix?: string,
    page: number = 0
  ): Observable<{ data: HashtagSuggester[]; nextPage: boolean }> {
    const category_id = categoryId.toString();
    const start = page.toString();
    return this.getHashTagSuggesters(category_id, start, isGernalHashTag, prefix).pipe(
      map((response) => {
        const nextPage = !!response.headers.get('x-nextpage');
        return { data: response.body.hashtags, nextPage: nextPage };
      })
    );
  }
}

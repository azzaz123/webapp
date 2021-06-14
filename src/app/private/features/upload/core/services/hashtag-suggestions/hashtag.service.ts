import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HashtagResponse, Hashtag, HashtagWithPrefixResponse, HashtagWithOccurenciesInfo } from '../../models/hashtag-suggester.interface';

export const HASHTAG_SUGGESTERS_API = `api/v3/suggesters/hashtags`;
export const GENERAL_HASHTAG_SUGGESTERS_API = `${HASHTAG_SUGGESTERS_API}/general`;

@Injectable()
export class HashtagService {
  constructor(private http: HttpClient) {}

  private getHashtagsByPrefix(category_id: string, start: string, prefix: string): Observable<HttpResponse<HashtagWithPrefixResponse>> {
    const url = `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, prefix, start } });
    return this.http.get<HashtagWithPrefixResponse>(url, { params: httpParams, observe: 'response' });
  }

  private getlHashtags(category_id: string, start: string): Observable<HttpResponse<HashtagResponse>> {
    const url = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, start } });
    return this.http.get<HashtagResponse>(url, { params: httpParams, observe: 'response' });
  }

  public loadHashtags(categoryId: number, page: number = 0): Observable<{ data: Hashtag[]; nextPage: boolean }> {
    const category_id = categoryId.toString();
    const start = page.toString();
    return this.getlHashtags(category_id, start).pipe(
      map((response) => {
        const nextPage = !!response.headers.get('x-nextpage');
        return { data: response.body.hashtags, nextPage: nextPage };
      })
    );
  }

  public loadHashtagsByPrefix(
    categoryId: number,
    prefix: string = null,
    page: number = 0
  ): Observable<{ data: HashtagWithOccurenciesInfo[]; nextPage: boolean }> {
    const category_id = categoryId.toString();
    const start = page.toString();
    return this.getHashtagsByPrefix(category_id, start, prefix).pipe(
      map((response) => {
        const nextPage = !!response.headers.get('x-nextpage');
        return { data: response.body.hashtags, nextPage: nextPage };
      })
    );
  }
}

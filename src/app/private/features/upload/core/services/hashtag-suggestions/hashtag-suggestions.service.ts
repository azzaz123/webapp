import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HashtagResponse, GeneralHashtag, Hashtag } from '../../models/hashtag-suggester.interface';

export const HASHTAG_SUGGESTERS_API = `api/v3/suggesters/hashtags`;
export const GENERAL_HASHTAG_SUGGESTERS_API = `${HASHTAG_SUGGESTERS_API}/general`;

@Injectable()
export class HashtagSuggestionsService {
  constructor(private http: HttpClient) {}

  private getGeneralHashtags(category_id: string, start: string, prefix: string): Observable<HttpResponse<HashtagResponse>> {
    const url = `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, prefix, start } });
    return this.http.get<HashtagResponse>(url, { params: httpParams, observe: 'response' });
  }

  private getlHashtags(category_id: string, start: string, prefix: string): Observable<HttpResponse<HashtagResponse>> {
    const url = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, prefix, start } });
    return this.http.get<HashtagResponse>(url, { params: httpParams, observe: 'response' });
  }

  public loadHashtags(categoryId: number, prefix: string = null, page: number = 0): Observable<{ data: Hashtag[]; nextPage: boolean }> {
    const category_id = categoryId.toString();
    const start = page.toString();
    return this.getlHashtags(category_id, start, prefix).pipe(
      map((response) => {
        const nextPage = !!response.headers.get('x-nextpage');
        const data: Hashtag[] = response.body.hashtags.map((hashtag) => {
          return { text: hashtag.text };
        });
        return { data: data, nextPage: nextPage };
      })
    );
  }

  public loadGeneralHashtags(
    categoryId: number,
    prefix: string = null,
    page: number = 0
  ): Observable<{ data: GeneralHashtag[]; nextPage: boolean }> {
    const category_id = categoryId.toString();
    const start = page.toString();
    return this.getGeneralHashtags(category_id, start, prefix).pipe(
      map((response) => {
        const nextPage = !!response.headers.get('x-nextpage');
        return { data: response.body.hashtags, nextPage: nextPage };
      })
    );
  }
}

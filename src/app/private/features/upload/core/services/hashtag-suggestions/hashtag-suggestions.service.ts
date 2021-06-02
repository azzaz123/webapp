import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.beta';
import { Observable } from 'rxjs';

export const HASHTAG_SUGGESTERS_API_URL = `/api/v3/suggesters/hashtags`;

@Injectable({
  providedIn: 'root',
})
export class HashtagSuggestionsService {
  constructor(private http: HttpClient) {}

  public getHashTagSuggestors(category_id: string, prefix?: string, start: string = '0'): Observable<any> {
    const url = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API_URL}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, prefix, start } });
    return this.http.get(url, { params: httpParams });
  }
}

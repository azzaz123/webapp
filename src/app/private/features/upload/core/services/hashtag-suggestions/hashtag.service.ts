import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { PaginationService } from '@public/core/services/pagination/pagination.service';
import { Observable } from 'rxjs';
import { HashtagResponse, Hashtag } from '../../models/hashtag.interface';

export const HASHTAG_SUGGESTERS_API = `api/v3/suggesters/hashtags`;
export const GENERAL_HASHTAG_SUGGESTERS_API = `${HASHTAG_SUGGESTERS_API}/general`;

@Injectable()
export class HashtagService {
  constructor(private http: HttpClient, private paginationService: PaginationService) {}

  private getHashtagsByPrefix(category_id: string, start: string, prefix: string): Observable<HttpResponse<HashtagResponse>> {
    const url = `${environment.baseUrl}${GENERAL_HASHTAG_SUGGESTERS_API}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, prefix, start } });
    return this.http.get<HashtagResponse>(url, { params: httpParams, observe: 'response' });
  }

  private getHashtags(category_id: string, start: string): Observable<HttpResponse<HashtagResponse>> {
    const url = `${environment.baseUrl}${HASHTAG_SUGGESTERS_API}`;
    let httpParams: HttpParams = new HttpParams({ fromObject: { category_id, prefix: null, start } });
    return this.http.get<HashtagResponse>(url, { params: httpParams, observe: 'response' });
  }

  public getPaginationHashtags(categoryId: number, page: number = 0, prefix?: string): Observable<PaginationResponse<Hashtag[]>> {
    const category_id = categoryId.toString();
    const start = page.toString();
    return this.paginationService.getItems(
      prefix ? this.getHashtagsByPrefix(category_id, start, prefix) : this.getHashtags(category_id, start)
    );
  }
}

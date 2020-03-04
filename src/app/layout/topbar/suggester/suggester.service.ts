import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuggesterResponse } from './suggester-response.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export const SUGGESTER_ENDPOINT = 'api/v3/suggesters/search';
@Injectable()
export class SuggesterService {

  constructor(private http: HttpClient) { }

  public getSuggestions(keyword: string): Observable<SuggesterResponse[]> {
    return this.http.get<SuggesterResponse[]>(`${environment.baseUrl}${SUGGESTER_ENDPOINT}`, { params: { keyword } });
  }

}

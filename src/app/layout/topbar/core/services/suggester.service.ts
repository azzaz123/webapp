import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { SuggesterResponse } from '../interfaces/suggester-response.interface';

export const SUGGESTER_ENDPOINT = 'api/v3/suggesters/search';

@Injectable()
export class SuggesterService {
  constructor(private http: HttpClient) {}

  public getSuggestions(keyword: string): Observable<SuggesterResponse[]> {
    return this.http.get<SuggesterResponse[]>(
      `${environment.baseUrl}${SUGGESTER_ENDPOINT}`,
      { params: { keyword } }
    );
  }
}

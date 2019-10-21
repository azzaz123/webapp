import { IDictionary } from './../../../shared/models/dictionary.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuggesterResponse } from './suggester-response.interface';
import { HttpServiceNew } from '../../../core/http/http.service.new';

export const SUGGESTER_ENDPOINT = 'api/v3/suggesters/search';
@Injectable()
export class SuggesterService {


  constructor(private http: HttpServiceNew) { }

  public getSuggestions(query: string): Observable<SuggesterResponse[]> {
    const params: IDictionary[] = [{
      key: 'keyword',
      value: query
    }];
    
    return this.http.get(SUGGESTER_ENDPOINT, params);
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from 'shield';
import { environment } from '../../../environments/environment';
import { SuggesterResponse } from './suggester-response.interface';

@Injectable()
export class SuggesterService {

  constructor(private http: HttpService) { }

  public getSuggestions(query: string): Observable<SuggesterResponse[]> {
    let params: any =  {
      keyword: query
    };
    return this.http.getNoBase(environment.siteUrl + 'rest/suggesters/search', params)
      .map(res => res.json());
  }

}

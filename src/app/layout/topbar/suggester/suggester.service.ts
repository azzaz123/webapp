import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { SuggesterResponse } from './suggester-response.interface';
import { HttpService } from '../../../core/http/http.service';

@Injectable()
export class SuggesterService {

  constructor(private http: HttpService) { }

  public getSuggestions(query: string): Observable<SuggesterResponse[]> {
    const params: any =  {
      keyword: query
    };
    return this.http.getNoBase(environment.siteUrl + 'rest/suggesters/search', params)
      .map(res => res.json());
  }

}

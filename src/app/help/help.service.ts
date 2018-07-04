import { Injectable } from '@angular/core';
import { HttpService } from '../core/http/http.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HelpService {

  constructor(private http: HttpService) {
  }

  public getFaqs(locale: string): Observable<any> {
    return this.http.getNoBase('assets/json/faq.' + locale + '.json')
      .map(res => res.json());
  }

  public getFeatures(locale: string): Observable<any> {
    return this.http.getNoBase('assets/json/faq-features.' + locale + '.json')
      .map(res => res.json());
  }

}

import { Injectable } from '@angular/core';
import { HttpService } from '../core/http/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class HelpService {

  constructor(private http: HttpService) {
  }

  public getFaqs(locale: string): Observable<any> {
    return this.http.get(`assets/json/faq.${locale}.json`);
  }

  public getFeatures(locale: string): Observable<any> {
    return this.http.get(`assets/json/faq-features.${locale}.json`);
  }

}

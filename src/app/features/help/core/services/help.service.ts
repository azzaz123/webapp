import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HelpService {
  constructor(private http: HttpClient) {}

  public getFaqs(locale: string): Observable<any> {
    return this.http.get(`assets/json/faq.${locale}.json`);
  }

  public getFeatures(locale: string): Observable<any> {
    return this.http.get(`assets/json/faq-features.${locale}.json`);
  }
}

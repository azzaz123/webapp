import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpService } from "shield";
import { environment } from "../../../environments/environment";

@Injectable()
export class CategoryService {
  protected API_URL_V3: string = 'api/v3/';

  constructor(private http: HttpService) { }

  public getCategories(): Observable<any> {
    return this.http.getNoBase(environment.siteUrl + 'rest/categories')
      .map(res => res.json());
  }

}

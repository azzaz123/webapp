import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpService } from "shield";
import { environment } from "../../../environments/environment";
import { CategoryResponse } from "./category-response.interface";

@Injectable()
export class CategoryService {

  constructor(private http: HttpService) { }

  public getCategories(): Observable<CategoryResponse[]> {
    return this.http.getNoBase(environment.siteUrl + 'rest/categories')
      .map(res => res.json());
  }

}

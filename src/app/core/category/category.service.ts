import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpService } from "shield";

@Injectable()
export class CategoryService {

  constructor(private http: HttpService) { }

  public getCategories(): Observable<any> {
    /*return this.http.get(this.API_URL_V1 + '/categories')
      .map(res => res.json());*/
    return Observable.of([{id: 100, name: 'Coches'}, {id: 2, name: 'Juegos'}]);
  }

}

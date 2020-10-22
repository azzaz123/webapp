import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  constructor(private httpClient: HttpClient) { }

  public getIconByPath(path: string): Observable<string> {
    return this.httpClient.get(path, {
      responseType: 'text'
    })
  }
}

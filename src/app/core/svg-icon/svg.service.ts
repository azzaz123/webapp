import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  constructor(private httpClient: HttpClient) { }

  public getIconByPath(path: string): Observable<string> {
    return this.httpClient.get(path, {
      responseType: 'text',
      headers: { 'Content-Type': 'image/svg+xml'}
    }).pipe(
      // TODO: Remove when Cloudfront handles not found SVGs with 404
      map(response => response.startsWith('<svg') ? response : '<svg></svg>'),
    );
  }
}

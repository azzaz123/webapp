import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SvgService {
  private cachedIcons: Map<string, Observable<string>> = new Map<string, Observable<string>>();

  constructor(private httpClient: HttpClient) {}

  public getIconByPath(path: string): Observable<string> {
    const cachedIcon = this.cachedIcons.get(path);
    if (cachedIcon) {
      return cachedIcon;
    }

    this.cachedIcons.set(path, this.getIconOverNetwork(path));
    return this.cachedIcons.get(path);
  }

  private getIconOverNetwork(path: string): Observable<string> {
    return this.httpClient
      .get(path, {
        responseType: 'text',
        headers: { 'Content-Type': 'image/svg+xml' },
      })
      .pipe(
        shareReplay(1),
        catchError((error) => {
          this.removeIconFromCache(path);
          return throwError(error);
        })
      );
  }

  private removeIconFromCache(path: string): void {
    if (this.cachedIcons.has(path)) {
      this.cachedIcons.delete(path);
    }
  }
}


import {of as observableOf,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReviewDataBuyer, ReviewDataSeller } from './review.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const REVIEWS_API_URL = 'api/v3/reviews';

@Injectable()
export class ReviewService {

  constructor(private http: HttpClient) {
  }

  public check(itemId: string): Observable<boolean> {
    return this.http.head(`${environment.baseUrl}${REVIEWS_API_URL}/${itemId}`).pipe(
      map(() => {
        return true;
      }),
      catchError(() => {
        return observableOf(false);
      }),);
  }

  public createAsBuyer(reviewData: ReviewDataBuyer): Observable<any> {
    return this.http.post(`${environment.baseUrl}${REVIEWS_API_URL}/buyer`, reviewData);
  }

  public createAsSeller(reviewData: ReviewDataSeller): Observable<any> {
    return this.http.post(`${environment.baseUrl}${REVIEWS_API_URL}/seller`, reviewData);
  }

}

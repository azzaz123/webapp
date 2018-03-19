import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ReviewDataBuyer, ReviewDataSeller } from './review.interface';

@Injectable()
export class ReviewService {

  protected API_URL_V3: string = 'api/v3/reviews';

  constructor(private http: HttpService) {
  }

  public check(itemId: string): Observable<boolean> {
    return this.http.head(this.API_URL_V3 + '/' + itemId)
    .map(() => {
      return true;
    })
    .catch(() => {
      return Observable.of(false);
    });
  }

  public createAsBuyer(reviewData: ReviewDataBuyer): Observable<any> {
    return this.http.post(this.API_URL_V3 + '/buyer', reviewData);
  }

  public createAsSeller(reviewData: ReviewDataSeller): Observable<any> {
    return this.http.post(this.API_URL_V3 + '/seller', reviewData);
  }


}

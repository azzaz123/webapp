import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { ReviewsData, ReviewResponse } from "./review-response.interface";
import { Response } from '@angular/http';
import {
  HttpService,
} from 'shield';
import { Review } from "./review";

@Injectable()
export class ReviewService {

  private API_URL_WEB: string = 'api/v3/web/items';
  private API_URL_v3_USER: string = 'api/v3/users';
  
  constructor(private http: HttpService) { }

  public getPaginationReviews(url: string, init): Observable<ReviewsData> {
    return this.http.get(url, {
        init: init
      })
      .map((r: Response) => {
          const res: ReviewResponse[] = r.json();
          const nextPage: string = r.headers.get('x-nextpage');
          const nextInit: number = nextPage ? +nextPage.replace('init=', '') : null;
          let data: Review[] = [];
          if (res.length > 0) {
            data = res.map((i: ReviewResponse) => {
              return this.mapRecordData(i);
            });
          }
          return {
            data: data,
            init: nextInit
          }
        }
      )
  }
  
  public myReviews(init: number): Observable<ReviewsData> {
    return this.getPaginationReviews(this.API_URL_WEB + '/myreviews/', init)
  }

  protected mapRecordData(data: ReviewResponse): Review {
    return new Review(
      data.id,
      data.title,
      data.description,
      data.category,
      data.saleDate,
      data.image,
      data.transactionUser
    );
  }

}

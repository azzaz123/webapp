import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { MyReviewsResponse, MyReviewsData } from "./my-reviews-response.interface";
import { Response } from '@angular/http';
import {
  HttpService,
} from 'shield';
import { MyReviews } from "./my-reviews";
import { CategoryService } from "../category/category.service";
import { CategoryResponse } from "../category/category-response.interface";

@Injectable()
export class MyReviewsService {

  private API_URL_WEB: string = 'api/v3/web/items';
  private API_URL_v3_USER: string = 'api/v3/users';
  
  constructor(private http: HttpService,
              private categoryService: CategoryService) {
  }

  public getPaginationReviews(url: string, init): Observable<MyReviewsData> {
    return this.http.get(url, {
        init: init
      })
      .map((r: Response) => {
          const res: MyReviewsResponse[] = r.json();
          const nextPage: string = r.headers.get('x-nextpage');
          const nextInit: number = nextPage ? +nextPage.replace('init=', '') : null;
          let data: MyReviews[] = [];
          if (res.length > 0) {
            data = res.map((i: any) => {
              if(i.item) {
                this.categoryService.getCategories().subscribe((categories: CategoryResponse[]) => {
                  i.item.category = categories.find((category: CategoryResponse) => {
                    return category.categoryId === i.item.category_id;
                  });
                });
              }
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
  
  public myReviews(init: number): Observable<MyReviewsData> {
    return this.getPaginationReviews(this.API_URL_v3_USER + '/me/reviews', init);
  }

  private mapRecordData(data: MyReviewsResponse): MyReviews {
    return new MyReviews(
      data.item,
      data.review,
      data.type,
      data.user
    );
  }

}

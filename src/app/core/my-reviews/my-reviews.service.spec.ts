import { TestBed, inject } from '@angular/core/testing';
import { MyReviewsService } from './my-reviews.service';
import {
  HttpService
} from 'shield';
import { CategoryService } from '../../core/category/category.service';
import { Observable } from "rxjs/Observable";
import { CATEGORY_DATA_WEB } from "../../../tests/category.fixtures";

describe('MyReviewsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyReviewsService,
        {provide: HttpService, useValue: {}},
        {provide: CategoryService, useValue: {
          getCategories: () => {
            return Observable.of(CATEGORY_DATA_WEB);
          }
        }},
      ]
    });
  });

  it('should be created', inject([MyReviewsService], (service: MyReviewsService) => {
    expect(service).toBeTruthy();
  }));
});

import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewsComponent } from './reviews.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MyReviewsService } from "../core/my-reviews/my-reviews.service";
import { Observable } from "rxjs/Observable";
import { MOCK_MY_REVIEWS } from "../../tests/review.fixtures";
import { MOCK_USER } from 'shield';
import { UserService } from '../core/user/user.service';
import {USER_INFO_RESPONSE} from "../../tests/user.fixtures";

describe('ReviewsComponent', () => {
  let component: ReviewsComponent;
  let fixture: ComponentFixture<ReviewsComponent>;
  let myReviewsService: MyReviewsService;
  let userService: UserService;
  let myReviewsServiceSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewsComponent ],
        providers: [
          {
            provide: UserService, useValue: {
              me() {
                return Observable.of(MOCK_USER);
              },
              getInfo() {
                return Observable.of(USER_INFO_RESPONSE);
              }
            }
          },
          {
            provide: MyReviewsService, useValue: {
              myReviews () {
                return Observable.of({data: [MOCK_MY_REVIEWS, MOCK_MY_REVIEWS], init: 2});
              }
            }
          },
      ],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsComponent);
    userService = TestBed.get(UserService);
    myReviewsService = TestBed.get(MyReviewsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('getReviews', () => {

    beforeEach(fakeAsync(() => {
      spyOn(component, 'getReviews').and.callThrough();
      myReviewsServiceSpy = spyOn(myReviewsService, 'myReviews').and.callThrough();
    }));

    it('should call myReviews OnInit', () => {
      component.ngOnInit();

      expect(component.getReviews).toHaveBeenCalled();
    });

    it('should call myReviews with reviews length', () => {
      let itemLength = component.reviews.length;

      component.getReviews(true);

      expect(myReviewsService.myReviews).toHaveBeenCalledWith(itemLength);
    });

    it('if append argument is true, current component.item should add ', () => {
      component.reviews = [MOCK_MY_REVIEWS];
      component.getReviews(true);

      expect(component.reviews).toEqual([MOCK_MY_REVIEWS, MOCK_MY_REVIEWS, MOCK_MY_REVIEWS]);
    });

    it('should set loading to false', () => {
      component.loading = true;
      component.getReviews();

      expect(component.loading).toBeFalsy();
    });

    it('should set end true if no init', () => {
      myReviewsServiceSpy.and.returnValue(Observable.of({data: [MOCK_MY_REVIEWS, MOCK_MY_REVIEWS], init: null}));

      component.getReviews();

      expect(component['end']).toBeTruthy();
    });
  });

  describe('getUserReview', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'getUserReview').and.callThrough();
      spyOn(userService, 'me').and.callThrough();
      spyOn(userService, 'getInfo').and.callThrough();
    }));

    it('should get the user score', () => {
      component.getUserReview();

      expect(userService.me).toHaveBeenCalled();
      expect(userService.getInfo).toHaveBeenCalled();
      expect(component.userScore).toEqual(USER_INFO_RESPONSE.scoring_stars);
    });
  });

  describe('loadMore', () => {
    beforeEach(() => {
      spyOn(component, 'getReviews');
    });

    it('should call getReviews with true', () => {
      component.loadMore();

      expect(component.getReviews).toHaveBeenCalledWith(true);
    });
  });
  
});

import { fakeAsync, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReviewsComponent } from './reviews.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MOCK_USER, USER_INFO_RESPONSE, USERS_STATS, MOCK_USER_STATS } from '../../../../../tests/user.fixtures.spec';
import { UserService } from 'app/core/user/user.service';
import { MOCK_REVIEWS } from '../../../../../tests/review.fixtures.spec';
import { UserReviewService } from '../core/user-review.service';

describe('ReviewsComponent', () => {
  let component: ReviewsComponent;
  let fixture: ComponentFixture<ReviewsComponent>;
  let reviewService: UserReviewService;
  let userService: UserService;
  let myReviewsServiceSpy: jasmine.Spy;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReviewsComponent],
        providers: [
          {
            provide: UserService,
            useValue: {
              user: MOCK_USER,
              getInfo() {
                return of(USER_INFO_RESPONSE);
              },
              getStats() {
                return of(MOCK_USER_STATS);
              },
            },
          },
          {
            provide: UserReviewService,
            useValue: {
              getPaginationReviews() {
                return of({ data: MOCK_REVIEWS, init: 2 });
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsComponent);
    userService = TestBed.inject(UserService);
    reviewService = TestBed.inject(UserReviewService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('getReviews', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'getReviews').and.callThrough();
      myReviewsServiceSpy = spyOn(reviewService, 'getPaginationReviews').and.callThrough();
    }));

    it('should call getReviews OnInit', () => {
      component.ngOnInit();

      expect(component.getReviews).toHaveBeenCalled();
    });

    it('should call getReviews with reviews length', () => {
      const itemLength = component.reviews.length;

      component.getReviews(true);

      expect(reviewService.getPaginationReviews).toHaveBeenCalledWith(itemLength);
    });

    it('if append argument is true, current component.item should add ', () => {
      component.reviews = MOCK_REVIEWS;

      component.getReviews(true);

      expect(component.reviews).toEqual([MOCK_REVIEWS[0], MOCK_REVIEWS[0]]);
    });

    it('should set loading to false', () => {
      component.loading = true;
      component.getReviews();

      expect(component.loading).toBeFalsy();
    });

    it('should set end true if no init', () => {
      myReviewsServiceSpy.and.returnValue(of({ data: MOCK_REVIEWS, init: null }));

      component.getReviews();

      expect(component['end']).toBeTruthy();
    });
  });

  describe('getUserScore', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'getUserScore').and.callThrough();
      spyOn(userService, 'getInfo').and.callThrough();
    }));

    it('should get the user score', () => {
      component.getUserScore();

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

  describe('getNumberOfReviews', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'getNumberOfReviews').and.callThrough();
      spyOn(userService, 'getStats').and.callThrough();
    }));

    it('should get reviews number', () => {
      component.getNumberOfReviews();

      expect(userService.getStats).toHaveBeenCalled();
      expect(component.numberOfReviews).toEqual(MOCK_USER_STATS.counters.reviews);
    });
  });
});

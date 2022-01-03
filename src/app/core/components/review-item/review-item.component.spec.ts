import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { MOCK_REVIEWS, MOCK_TRANSLATABLE_REVIEW } from '@fixtures/review.fixtures.spec';
import { CATEGORY_DATA_WEB } from '@fixtures/category.fixtures.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReviewItemComponent } from './review-item.component';
import { Component, DebugElement, Input, NO_ERRORS_SCHEMA } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';
import { CategoryService } from 'app/core/category/category.service';
import { SanitizedBackgroundDirective } from 'app/shared/sanitized-background/sanitized-background.directive';
import { UserProfileRoutePipe } from '@shared/pipes';
import { ReviewsApiModule, ReviewsApiService } from '@api/reviews';
import { By } from '@angular/platform-browser';
import { TranslateButtonComponent } from '@core/components/translate-button/translate-button.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Review } from '@private/features/reviews/core/review';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { Router } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';
import { StandaloneService } from '@core/standalone/services/standalone.service';

const MOCK_REVIEW: Review = MOCK_REVIEWS[0];
const IMAGE_CLASS_NAME: string = '.image';
const REVIEW_TITLE_CLASS_NAME: string = '.review-title-item';

@Component({
  selector: 'tsl-test',
  template: '<tsl-review-item [isOwner]="isOwner" [review]="review"></tsl-review-item>',
})
class TestComponent {
  @Input() isOwner = false;
  @Input() review: Review;
}

describe('ReviewItemComponent', () => {
  let testComponent: TestComponent;
  let component: ReviewItemComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let reviewsApiService: ReviewsApiService;
  let router: Router;

  const standaloneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReviewItemComponent, SanitizedBackgroundDirective, UserProfileRoutePipe, TestComponent, TranslateButtonComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [ReviewsApiModule, HttpClientTestingModule, SharedModule, CoreModule],
        providers: [
          {
            provide: CategoryService,
            useValue: {
              getCategoryById: () => {
                return of(CATEGORY_DATA_WEB[0]);
              },
            },
          },
          {
            provide: StandaloneService,
            useValue: {
              standalone$: standaloneSubject.asObservable(),
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
          {
            provide: SITE_URL,
            useValue: MOCK_SITE_URL,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    reviewsApiService = TestBed.inject(ReviewsApiService);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(ReviewItemComponent)).componentInstance;
    testComponent.review = MOCK_REVIEWS[0];
    router = TestBed.inject(Router);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set reviewUser', () => {
      expect(component.reviewUser).toBe(MOCK_REVIEWS[0].user);
    });
  });

  describe('when the item is ours...', () => {
    beforeEach(() => {
      testComponent.isOwner = true;
      fixture.detectChanges();
    });
    it('should return the correct sold copy', () => {
      expect(component.reviewItemCopies.soldCopy).toBe($localize`:@@OwnReview_Sold:Sold`);
    });

    it('should return the correct bought copy', () => {
      expect(component.reviewItemCopies.boughtCopy).toBe($localize`:@@OwnReview_Bought:Bought`);
    });
  });

  describe('when the item is NOT ours...', () => {
    beforeEach(() => {
      testComponent.isOwner = false;
      fixture.detectChanges();
    });
    it('should return the correct sold copy', () => {
      expect(component.reviewItemCopies.soldCopy).toBe($localize`:@@Review_Sold:Sold`);
    });

    it('should return the correct bought copy', () => {
      expect(component.reviewItemCopies.boughtCopy).toBe($localize`:@@Review_Bought:Bought`);
    });
  });

  describe('when review cannot be translated', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should not show translate button', () => {
      const translateButton = debugElement.query(By.directive(TranslateButtonComponent));

      expect(translateButton).toBeFalsy();
    });
  });

  describe('when review can be translated', () => {
    const translateButtonPredicate = By.directive(TranslateButtonComponent);

    beforeEach(() => {
      testComponent.review = MOCK_TRANSLATABLE_REVIEW;
      fixture.detectChanges();
    });

    it('should show translate button', () => {
      const translateButton = debugElement.query(translateButtonPredicate);

      expect(translateButton).toBeTruthy();
    });

    describe('and button is clicked', () => {
      const commentPredicate = By.css('.review-comment');
      const translatedComment = 'Translated comment';

      describe('when showing original', () => {
        describe('and translation has not been retrieved yet', () => {
          it('should retrieve translation and show it', () => {
            spyOn(reviewsApiService, 'getReviewTranslation').and.returnValue(of(translatedComment));

            debugElement.query(By.directive(TranslateButtonComponent)).nativeElement.click();
            fixture.detectChanges();
            const comment = debugElement.query(commentPredicate).nativeElement.innerHTML;

            expect(reviewsApiService.getReviewTranslation).toHaveBeenCalledTimes(1);
            expect(reviewsApiService.getReviewTranslation).toHaveBeenCalledWith(MOCK_TRANSLATABLE_REVIEW.id);
            expect(comment).toEqual(translatedComment);
          });
        });

        describe('and translation has been retrieved already', () => {
          beforeEach(() => {
            component['translation'] = translatedComment;
          });

          it('should use old translation and show it', () => {
            spyOn(reviewsApiService, 'getReviewTranslation');

            debugElement.query(By.directive(TranslateButtonComponent)).nativeElement.click();
            fixture.detectChanges();
            const comment = debugElement.query(commentPredicate).nativeElement.innerHTML;

            expect(reviewsApiService.getReviewTranslation).toHaveBeenCalledTimes(0);
            expect(comment).toEqual(translatedComment);
          });
        });
      });

      describe('when showing translation', () => {
        describe('and button is clicked again', () => {
          beforeEach(() => {
            component['translation'] = translatedComment;
            debugElement.query(By.directive(TranslateButtonComponent)).nativeElement.click();
            fixture.detectChanges();
          });

          it('should show original', () => {
            debugElement.query(By.directive(TranslateButtonComponent)).nativeElement.click();
            fixture.detectChanges();
            const comment = debugElement.query(commentPredicate).nativeElement.innerHTML;

            expect(comment).toEqual(MOCK_TRANSLATABLE_REVIEW.comments);
          });
        });
      });
    });
  });

  describe('when a click is triggered on an item image from a review', () => {
    describe('and the app is on standalone mode', () => {
      beforeEach(() => {
        standaloneSubject.next(true);
        fixture.detectChanges();
        spyOn(router, 'navigate');
      });
      it('should navigate to the item without opening a new tab', () => {
        const expectedUrl: string = `${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_REVIEW.item.id}`;
        const itemImage = fixture.debugElement.query(By.css(IMAGE_CLASS_NAME)).nativeElement;

        itemImage.click();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });
    describe('and the app is NOT on standalone mode', () => {
      beforeEach(() => {
        standaloneSubject.next(false);
        fixture.detectChanges();
        spyOn(window, 'open');
      });
      it('should navigate to the item in a new tab', () => {
        const expectedUrl: string = `${MOCK_SITE_URL}${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_REVIEW.item.webSlug}`;
        const itemImage = fixture.debugElement.query(By.css(IMAGE_CLASS_NAME)).nativeElement;

        itemImage.click();

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(expectedUrl);
      });
    });
  });

  describe('when a click is triggered on a review title', () => {
    describe('and the app is on standalone mode', () => {
      beforeEach(() => {
        standaloneSubject.next(true);
        fixture.detectChanges();
        spyOn(router, 'navigate');
      });
      it('should navigate to the item without opening a new tab', () => {
        const expectedUrl: string = `${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_REVIEW.item.id}`;
        const reviewTitle = fixture.debugElement.query(By.css(REVIEW_TITLE_CLASS_NAME)).nativeElement;

        reviewTitle.click();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });
    describe('and the app is NOT on standalone mode', () => {
      beforeEach(() => {
        standaloneSubject.next(false);
        fixture.detectChanges();
        spyOn(window, 'open');
      });
      it('should navigate to the item in a new tab', () => {
        const expectedUrl: string = `${MOCK_SITE_URL}${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_REVIEW.item.webSlug}`;
        const reviewTitle = fixture.debugElement.query(By.css(REVIEW_TITLE_CLASS_NAME)).nativeElement;

        reviewTitle.click();

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(expectedUrl);
      });
    });
  });
});

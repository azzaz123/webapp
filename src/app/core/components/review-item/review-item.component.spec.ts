import { MOCK_REVIEWS, MOCK_TRANSLATABLE_REVIEW } from '@fixtures/review.fixtures.spec';
import { CATEGORY_DATA_WEB } from '@fixtures/category.fixtures.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReviewItemComponent } from './review-item.component';
import { Component, DebugElement, Input, NO_ERRORS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';
import { CategoryService } from 'app/core/category/category.service';
import { SanitizedBackgroundDirective } from 'app/shared/sanitized-background/sanitized-background.directive';
import { environment } from 'environments/environment';
import { UserProfileRoutePipe } from '@shared/pipes';
import { ReviewsApiModule, ReviewsApiService } from '@api/reviews';
import { By } from '@angular/platform-browser';
import { TranslateButtonComponent } from '@core/components/translate-button/translate-button.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Review } from '@private/features/reviews/core/review';

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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReviewItemComponent, SanitizedBackgroundDirective, UserProfileRoutePipe, TestComponent, TranslateButtonComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [ReviewsApiModule, HttpClientTestingModule],
        providers: [
          { provide: 'SUBDOMAIN', useValue: 'www' },
          {
            provide: CategoryService,
            useValue: {
              getCategoryById: () => {
                return of(CATEGORY_DATA_WEB[0]);
              },
            },
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
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should set itemWebLink', () => {
      expect(component.itemWebLink).toBe(environment.siteUrl.replace('es', 'www') + 'item/' + MOCK_REVIEWS[0].item.webSlug);
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

import { MOCK_REVIEWS } from '@fixtures/review.fixtures.spec';
import { CATEGORY_DATA_WEB } from '@fixtures/category.fixtures.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReviewItemComponent } from './review-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';
import { CategoryService } from 'app/core/category/category.service';
import { SanitizedBackgroundDirective } from 'app/shared/sanitized-background/sanitized-background.directive';
import { environment } from 'environments/environment';
import { UserProfileRoutePipe } from '@shared/pipes';

describe('ReviewItemComponent', () => {
  let component: ReviewItemComponent;
  let fixture: ComponentFixture<ReviewItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReviewItemComponent, SanitizedBackgroundDirective, UserProfileRoutePipe],
        schemas: [NO_ERRORS_SCHEMA],
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
    fixture = TestBed.createComponent(ReviewItemComponent);
    component = fixture.componentInstance;
    component.review = MOCK_REVIEWS[0];
    fixture.detectChanges();
    component.ngOnInit();
  });

  describe('ngOnInit', () => {
    it('should set itemWebLink', () => {
      expect(component.itemWebLink).toBe(environment.siteUrl.replace('es', 'www') + 'item/' + MOCK_REVIEWS[0].item.webSlug);
    });

    it('should set reviewUser', () => {
      expect(component.reviewUser).toBe(MOCK_REVIEWS[0].user);
    });
  });

  describe('when the item is ours...', () => {
    beforeEach(() => {
      component.isOwner = true;

      component.ngOnInit();
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
      component.isOwner = false;

      component.ngOnInit();
    });
    it('should return the correct sold copy', () => {
      expect(component.reviewItemCopies.soldCopy).toBe($localize`:@@Review_Sold:Sold`);
    });

    it('should return the correct bought copy', () => {
      expect(component.reviewItemCopies.boughtCopy).toBe($localize`:@@Review_Bought:Bought`);
    });
  });
});

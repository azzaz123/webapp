import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_REVIEWS } from '@fixtures/review.fixtures.spec';
import { MOCK_FULL_USER_FEATURED } from '@fixtures/user.fixtures.spec';
import { EmptyStateComponent } from '@public/shared/components/empty-state/empty-state.component';
import { of } from 'rxjs';
import { PublicProfileService } from '../../core/services/public-profile.service';

import { UserReviewsComponent } from './user-reviews.component';

describe('UserReviewsComponent', () => {
  let component: UserReviewsComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<UserReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: PublicProfileService,
          useValue: {
            user: of(MOCK_FULL_USER_FEATURED),
            getReviews() {
              return of(MOCK_REVIEWS);
            },
          },
        },
      ],
      declarations: [UserReviewsComponent, EmptyStateComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReviewsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when component inits', () => {
    const reviewSelector = 'tsl-review-item';

    it('should print same amount of reviews received', () => {
      const componentReviewsLength = component.reviews.length;
      const domReviewsLength = el.querySelectorAll(reviewSelector).length;

      expect(componentReviewsLength).toEqual(domReviewsLength);
    });
  });

  describe(`when the user doesn't have reviews...`, () => {
    it('should show the empty state', () => {
      component.reviews = [];

      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.directive(EmptyStateComponent));
      expect(emptyState).toBeTruthy();
    });
  });

  describe(`when the user have reviews...`, () => {
    it('should not show the empty state', () => {
      component.reviews = MOCK_REVIEWS;

      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.directive(EmptyStateComponent));
      expect(emptyState).toBeFalsy();
    });
  });
});

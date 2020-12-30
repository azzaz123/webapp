import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MOCK_REVIEWS } from '@fixtures/review.fixtures.spec';
import { MOCK_FULL_USER_FEATURED } from '@fixtures/user.fixtures.spec';
import { PaginationService } from '@public/core/services/pagination/pagination.service';
import { of } from 'rxjs';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { MapReviewService } from './services/map-review/map-review.service';

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
        MapReviewService,
        PaginationService,
      ],
      declarations: [UserReviewsComponent],
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

    it('should print same amount of reviews recieved', () => {
      const componentReviewsLength = component.reviews.length;
      const domReviewsLength = el.querySelectorAll(reviewSelector).length;

      expect(componentReviewsLength).toEqual(domReviewsLength);
    });
  });
});

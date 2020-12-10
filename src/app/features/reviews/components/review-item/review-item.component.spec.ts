import {
  MOCK_REVIEWS,
  REVIEWS_RESPONSE,
} from './../../../../../tests/review.fixtures.spec';
import { CATEGORY_DATA_WEB } from './../../../../../tests/category.fixtures.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReviewItemComponent } from './review-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';
import { CategoryService } from 'app/core/category/category.service';
import { SanitizedBackgroundDirective } from 'app/shared/sanitized-background/sanitized-background.directive';
import { environment } from 'environments/environment';

describe('ReviewItemComponent', () => {
  let component: ReviewItemComponent;
  let fixture: ComponentFixture<ReviewItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReviewItemComponent, SanitizedBackgroundDirective],
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
      expect(component.itemWebLink).toBe(
        environment.siteUrl.replace('es', 'www') +
          'item/' +
          MOCK_REVIEWS[0].item.webSlug
      );
    });

    it('should set userWebSlug', () => {
      expect(component.userWebSlug).toBe(
        environment.siteUrl.replace('es', 'www') +
          'user/' +
          REVIEWS_RESPONSE[0].user.web_slug
      );
    });

    it('should set category', () => {
      expect(component.category).toBe(CATEGORY_DATA_WEB[0]);
    });
  });
});

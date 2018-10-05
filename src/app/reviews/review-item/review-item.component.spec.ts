import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewItemComponent } from './review-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_REVIEWS, REVIEWS_RESPONSE } from '../../../tests/review.fixtures.spec';
import { SanitizedBackgroundDirective } from '../../shared/sanitized-background/sanitized-background.directive';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures.spec';
import { CategoryService } from '../../core/category/category.service';
import { Observable } from 'rxjs/Observable';

const WEB_SLUG_ITEM = 'https://www.wallapop.com/item/';
const WEB_SLUG_USER = 'https://www.wallapop.com/user/';

describe('ReviewItemComponent', () => {
  let component: ReviewItemComponent;
  let fixture: ComponentFixture<ReviewItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewItemComponent, SanitizedBackgroundDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: 'SUBDOMAIN', useValue: 'www'} ,
        { provide: CategoryService,
          useValue: {
            getCategoryById: () => {
              return Observable.of(CATEGORY_DATA_WEB[0]);
            }
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewItemComponent);
    component = fixture.componentInstance;
    component.review = MOCK_REVIEWS[0];
    fixture.detectChanges();
    component.ngOnInit();
  });

  describe('ngOnInit', () => {
    it('should set itemWebLink', () => {
      expect(component.itemWebLink).toBe(WEB_SLUG_ITEM + MOCK_REVIEWS[0].item.webSlug);
    });

    it('should set userWebSlug', () => {
      expect(component.userWebSlug).toBe(WEB_SLUG_USER + REVIEWS_RESPONSE[0].user.web_slug);
    });

    it('should set category', () => {
      expect(component.category).toBe(CATEGORY_DATA_WEB[0]);
    });
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewItemComponent } from './review-item.component';
import { SanitizedBackgroundDirective, USER_BASE_PATH, ITEM_BASE_PATH } from 'shield';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_REVIEWS, REVIEWS_RESPONSE } from '../../../tests/review.fixtures';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures';
import { CategoryService } from '../../core/category/category.service';
import { Observable } from 'rxjs/Observable';

const category = CATEGORY_DATA_WEB[0];
const WEB_SLUG_ITEM_ES = 'https://es.wallapop.com/item/';
const WEB_SLUG_USER_ES = 'https://es.wallapop.com/user/';

describe('ReviewItemComponent', () => {
  let component: ReviewItemComponent;
  let fixture: ComponentFixture<ReviewItemComponent>;
  let service: CategoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewItemComponent, SanitizedBackgroundDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: CategoryService, useValue: {
          getCategoryById: () => {
            return Observable.of(category);
          }
        }},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewItemComponent);
    component = fixture.componentInstance;
    component.review = MOCK_REVIEWS[0];
    fixture.detectChanges();
    service = TestBed.get(CategoryService);

    spyOn(service, 'getCategoryById').and.callThrough();
    component.ngOnInit();
  });

  describe('ngOnInit', () => {
    it('set category name and icon', () => {
      expect(service.getCategoryById).toHaveBeenCalledWith(component.review.item.categoryId);
      expect(component.categoryIconName).toEqual(category.iconName);
      expect(component.categoryName).toEqual(category.title);
    });

    it('should set itemWebLink', () => {
      expect(component.itemWebLink).toBe(WEB_SLUG_ITEM_ES + MOCK_REVIEWS[0].item.webSlug);
    });

    it('should set userWebSlug', () => {
      expect(component.userWebSlug).toBe(WEB_SLUG_USER_ES + REVIEWS_RESPONSE[0].user.web_slug);
    });
  });
});
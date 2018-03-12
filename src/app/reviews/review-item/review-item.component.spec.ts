import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewItemComponent } from './review-item.component';
import { SanitizedBackgroundDirective, USER_BASE_PATH, ITEM_BASE_PATH } from 'shield';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_REVIEWS, REVIEWS_RESPONSE } from '../../../tests/review.fixtures';

const WEB_SLUG_ITEM_ES = 'https://es.wallapop.com/item/';
const WEB_SLUG_USER_ES = 'https://es.wallapop.com/user/';

describe('ReviewItemComponent', () => {
  let component: ReviewItemComponent;
  let fixture: ComponentFixture<ReviewItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewItemComponent, SanitizedBackgroundDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: 'SUBDOMAIN', useValue: 'www'}
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
      expect(component.itemWebLink).toBe(WEB_SLUG_ITEM_ES + MOCK_REVIEWS[0].item.webSlug);
    });

    it('should set userWebSlug', () => {
      expect(component.userWebSlug).toBe(WEB_SLUG_USER_ES + REVIEWS_RESPONSE[0].user.web_slug);
    });
  });
});

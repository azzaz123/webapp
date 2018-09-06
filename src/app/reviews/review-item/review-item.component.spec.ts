import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewItemComponent } from './review-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_REVIEWS, REVIEWS_RESPONSE } from '../../../tests/review.fixtures.spec';
import { SanitizedBackgroundDirective } from '../../shared/sanitized-background/sanitized-background.directive';
import { environment } from '../../../environments/environment';

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
      expect(component.itemWebLink).toBe(environment.siteUrl.replace('es', 'www') + 'item/' + MOCK_REVIEWS[0].item.webSlug);
    });

    it('should set userWebSlug', () => {
      expect(component.userWebSlug).toBe(environment.siteUrl.replace('es', 'www') + 'user/' + REVIEWS_RESPONSE[0].user.web_slug);
    });
  });
});

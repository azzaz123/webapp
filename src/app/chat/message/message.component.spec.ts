/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageComponent } from './message.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_REVIEWS, REVIEWS_RESPONSE } from '../../../tests/review.fixtures';
import { MOCK_MESSAGE, USER_WEB_SLUG } from 'shield';
import { User, USER_ID } from 'shield';

const WEB_SLUG_USER_ES = 'https://es.wallapop.com/user/';

describe('Component: Message', () => {
  let component: MessageComponent = new MessageComponent();
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    MOCK_MESSAGE.user = new User(USER_ID, null, null, null, null, null, null, null, null, null, null, null, null, USER_WEB_SLUG);
    component.message = MOCK_MESSAGE;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set userWebSlug', () => {
      expect(component.userWebSlug).toBe(WEB_SLUG_USER_ES + USER_WEB_SLUG);
    });
  });

});

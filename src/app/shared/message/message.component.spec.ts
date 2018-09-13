/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageComponent } from './message.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_MESSAGE } from '../../../tests/message.fixtures.spec';
import { USER_ID, USER_WEB_SLUG } from '../../../tests/user.fixtures.spec';
import { User } from '../../core/user/user';
import { environment } from '../../../environments/environment';

const WEB_SLUG_USER = 'https://www.wallapop.com/user/';

describe('Component: Message', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: 'SUBDOMAIN', useValue: 'www'},
      ]
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
      expect(component.userWebSlug).toBe(environment.siteUrl.replace('es', 'www') + 'user/' + USER_WEB_SLUG);
    });
  });

});

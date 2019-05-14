import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../../../../core/user/user.service';
import { MOCKED_INBOX_CONVERSATIONS } from '../../../../../../tests/inbox.fixtures.spec';
import { InboxUserDetailComponent } from './inbox-user-detail.component';
import { USER_INFO_RESPONSE, RESPONSE_RATE } from '../../../../../../tests/user.fixtures.spec';
import { SCORING_STARS } from '../../../../../../tests/profile.fixtures.spec';

class MockUserService {

  getInfo() {
    return Observable.of(USER_INFO_RESPONSE);
  }
}

describe('InboxUserDetailComponent', () => {
  let component: InboxUserDetailComponent;
  let fixture: ComponentFixture<InboxUserDetailComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboxUserDetailComponent ],
      providers: [
        {provide: UserService, useClass: MockUserService},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxUserDetailComponent);
    component = fixture.componentInstance;
    component.user = MOCKED_INBOX_CONVERSATIONS[0].user;
    userService = TestBed.get(UserService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      spyOn(userService, 'getInfo').and.callThrough();
    });
    it('should call getInfo and set user info', () => {
      component.user.score = undefined;
      component.user.responseRate = undefined;
      component.ngOnChanges({
        user: new SimpleChange(null, MOCKED_INBOX_CONVERSATIONS[0].user, false)
      });
      expect(userService.getInfo).toHaveBeenCalledWith(MOCKED_INBOX_CONVERSATIONS[0].user.id);
      expect(component.user.score).toBe(SCORING_STARS);
      expect(component.user.responseRate).toBe(RESPONSE_RATE);
    });
    it('should not call getInfo when user scoringStars and responseRate property', () => {
      component.user.score = 10;
      component.user.responseRate = 'test';
      component.ngOnChanges({
        user: new SimpleChange( component.user, MOCK_USER, false)
      });
      expect(userService.getInfo).not.toHaveBeenCalled();
      expect(component.user.score).toBe(10);
      expect(component.user.responseRate).toBe('test');
    });
    it('should not call getInfo when user is not changed', () => {
      component.ngOnChanges({});
      expect(userService.getInfo).not.toHaveBeenCalled();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../../../core/user/user.service';
import { MOCKED_INBOX_CONVERSATIONS } from '../../../../../tests/inbox.fixtures.spec';
import { InboxUserDetailComponent } from './inbox-user-detail.component';
import { USER_INFO_RESPONSE, SCORING_STARS, RESPONSE_RATE } from '../../../../../tests/user.fixtures.spec';
import { User } from '../../../../core/user/user';
import { InboxUser } from '../../../model/inbox-user';
import { Item } from '../../../../core/item/item';
import { InboxItem } from '../../../model/inbox-item';

class MockUserService {

  getInfo() {
    return Observable.of(USER_INFO_RESPONSE);
  }

  calculateDistanceFromItem(user: User | InboxUser, item: Item | InboxItem): number {
    return 5.5;
  }
}

describe('InboxUserDetailComponent', () => {
  let component: InboxUserDetailComponent;
  let fixture: ComponentFixture<InboxUserDetailComponent>;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InboxUserDetailComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(InboxUserDetailComponent);
    component = TestBed.createComponent(InboxUserDetailComponent).componentInstance;
    userService = TestBed.get(UserService);
    component.user = MOCKED_INBOX_CONVERSATIONS[0].user;
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      spyOn(userService, 'getInfo').and.callThrough();
    });

    it('should call getInfo and set user info', () => {
      component.user.score = undefined;
      component.user.responseRate = undefined;

      component.ngOnChanges({
        user: new SimpleChange(null, MOCKED_INBOX_CONVERSATIONS[0].user.id, false)
      });

      expect(userService.getInfo).toHaveBeenCalledWith(MOCKED_INBOX_CONVERSATIONS[0].user.id);
      expect(component.user.score).toBe(SCORING_STARS);
      expect(component.user.responseRate).toBe(RESPONSE_RATE);
    });

    it('should not call getInfo when user scoringStars and responseRate property', () => {
      component.user.score = 10;
      component.user.responseRate = 'test';
      component.user.distanceInKm = 5.5;

      component.ngOnChanges({
        user: new SimpleChange(null, MOCKED_INBOX_CONVERSATIONS[0].user.id, false)
      });

      expect(userService.getInfo).not.toHaveBeenCalled();
      expect(component.user.score).toBe(10);
      expect(component.user.responseRate).toBe('test');
      expect(component.user.distanceInKm).toBe(5.5);
    });
  });
});

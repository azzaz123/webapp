import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { InboxItem, InboxUser } from '@private/features/chat/core/model';
import { MOCKED_INBOX_CONVERSATIONS } from '@fixtures/chat';
import { RESPONSE_RATE, SCORING_STARS, USER_INFO_RESPONSE } from '@fixtures/user.fixtures.spec';
import { of } from 'rxjs';
import { InboxUserDetailComponent } from './inbox-user-detail.component';
import { UserProfileRoutePipe } from '@shared/pipes';

class MockUserService {
  getInfo() {
    return of(USER_INFO_RESPONSE);
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
      declarations: [InboxUserDetailComponent, UserProfileRoutePipe],
      providers: [{ provide: UserService, useClass: MockUserService }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(InboxUserDetailComponent);
    component = TestBed.createComponent(InboxUserDetailComponent).componentInstance;
    userService = TestBed.inject(UserService);
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
        user: new SimpleChange(null, MOCKED_INBOX_CONVERSATIONS[0].user.id, false),
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
        user: new SimpleChange(null, MOCKED_INBOX_CONVERSATIONS[0].user.id, false),
      });

      expect(userService.getInfo).not.toHaveBeenCalled();
      expect(component.user.score).toBe(10);
      expect(component.user.responseRate).toBe('test');
      expect(component.user.distanceInKm).toBe(5.5);
    });
  });
});

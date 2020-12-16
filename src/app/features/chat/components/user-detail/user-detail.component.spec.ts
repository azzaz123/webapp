import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserService } from '@core/user/user.service';
import {
  MOCK_USER,
  RESPONSE_RATE,
  SCORING_STARS,
  USER_INFO_RESPONSE,
} from '@fixtures/user.fixtures.spec';
import { of } from 'rxjs';
import { UserDetailComponent } from './user-detail.component';

class MockUserService {
  getInfo() {
    return of(USER_INFO_RESPONSE);
  }
}

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let userService: UserService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UserDetailComponent],
        providers: [{ provide: UserService, useClass: MockUserService }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    component.user = MOCK_USER;
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      spyOn(userService, 'getInfo').and.callThrough();
    });
    it('should call getInfo and set user info', () => {
      component.user.scoringStars = undefined;
      component.user.responseRate = undefined;
      component.ngOnChanges({
        user: new SimpleChange(null, MOCK_USER, false),
      });
      expect(userService.getInfo).toHaveBeenCalledWith(MOCK_USER.id);
      expect(component.user.scoringStars).toBe(SCORING_STARS);
      expect(component.user.responseRate).toBe(RESPONSE_RATE);
    });
    it('should not call getInfo when user scoringStars and responseRate property', () => {
      component.user.scoringStars = 10;
      component.user.responseRate = 'test';
      component.ngOnChanges({
        user: new SimpleChange(component.user, MOCK_USER, false),
      });
      expect(userService.getInfo).not.toHaveBeenCalled();
      expect(component.user.scoringStars).toBe(10);
      expect(component.user.responseRate).toBe('test');
    });
    it('should not call getInfo when user is not changed', () => {
      component.ngOnChanges({});
      expect(userService.getInfo).not.toHaveBeenCalled();
    });
  });
});

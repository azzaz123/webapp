import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailComponent } from './user-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { USER_DATA, User } from 'shield';
import { RESPONSE_RATE, SCORING_STARS, USER_INFO_RESPONSE } from '../../../tests/user.fixtures';

const MOCK_USER = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  USER_DATA.type,
  USER_DATA.received_reports,
  USER_DATA.web_slug
);

class MockUserService {

  public updateBlockStatus() {
  }


  getInfo() {
    return Observable.of(USER_INFO_RESPONSE)
  }

}

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailComponent ],
      providers: [
        {provide: UserService, useClass: MockUserService},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    component.user = MOCK_USER;
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
      component.user.scoringStars = undefined;
      component.user.responseRate = undefined;
      component.ngOnChanges({
        user: new SimpleChange(null, MOCK_USER, false)
      });
      expect(userService.getInfo).toHaveBeenCalledWith(MOCK_USER.id);
      expect(component.user.scoringStars).toBe(SCORING_STARS);
      expect(component.user.responseRate).toBe(RESPONSE_RATE);
    });
    it('should not call getInfo when user scoringStars and responseRate property', () => {
      component.user.scoringStars = 10;
      component.user.responseRate = 'test';
      component.ngOnChanges({
        user: new SimpleChange( component.user, MOCK_USER, false)
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
